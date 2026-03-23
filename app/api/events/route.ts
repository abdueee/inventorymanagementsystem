import { emitter } from "@/lib/sse/emitter";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  let cleanup = () => { };

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let isClosed = false;
      let intervalId: ReturnType<typeof setInterval> | null = null;
      let unsubscribe = () => { };

      cleanup = () => {
        if (isClosed) {
          return;
        }

        isClosed = true;

        if (intervalId) {
          clearInterval(intervalId);
        }

        unsubscribe();
        req.signal.removeEventListener("abort", cleanup);
      };

      const send = (chunk: string) => {
        if (isClosed) {
          return false;
        }

        try {
          controller.enqueue(encoder.encode(chunk));
          return true;
        } catch {
          cleanup();
          return false;
        }
      };

      // Send initial connection message
      if (!send("data: connected\n\n")) {
        return;
      }

      // Listen for events from the emitter
      unsubscribe = emitter.subscribe((event, data) => {
        const payload = JSON.stringify({ event, data });
        send(`data: ${payload}\n\n`);
      });

      // Clean up when client disconnects
      intervalId = setInterval(() => {
        send(": keepalive\n\n");
      }, 30000);

      if (req.signal.aborted) {
        cleanup();
        return;
      }

      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
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
