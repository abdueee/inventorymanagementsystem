import { emitter } from "@/lib/sse/emitter";

export const dynamic = "force-dynamic";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      controller.enqueue(encoder.encode("data: connected\n\n"));

      // Listen for events from the emitter
      const unsubscribe = emitter.subscribe((event, data) => {
        const payload = JSON.stringify({ event, data });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      });

      // Clean up when client disconnects
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(interval);
          unsubscribe();
        }
      }, 30000);
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
