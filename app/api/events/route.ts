import { createSubscriber, CHANNEL } from "@/lib/sse/emitter";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const subscriber = createSubscriber();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;
      let intervalId: ReturnType<typeof setInterval> | null = null;

      const cleanup = () => {
        if (isClosed) return;
        isClosed = true;
        if (intervalId) clearInterval(intervalId);
        subscriber.unsubscribe(CHANNEL);
        subscriber.quit();
        req.signal.removeEventListener("abort", cleanup);
      };

      const send = (chunk: string) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          cleanup();
        }
      };

      // Send initial connection confirmation
      send("data: connected\n\n");

      // Subscribe to the Redis channel — fires whenever any pod publishes
      await subscriber.subscribe(CHANNEL);
      subscriber.on("message", (_channel: string, _message: string) => {
        send(`data: ${JSON.stringify({ event: "inventory-updated" })}\n\n`);
      });

      // Keepalive ping every 30s to prevent connection timeouts
      intervalId = setInterval(() => send(": keepalive\n\n"), 30000);

      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      subscriber.unsubscribe(CHANNEL);
      subscriber.quit();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
