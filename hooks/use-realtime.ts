"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRealtime() {
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource("/api/events");

    eventSource.onmessage = (event) => {
      if (event.data === "connected") return;

      try {
        const { event: eventName } = JSON.parse(event.data);
        if (eventName === "inventory-updated") {
          router.refresh();
        }
      } catch {
        // ignore parse errors
      }
    };

    eventSource.onerror = () => {
      // EventSource automatically reconnects on error
    };

    return () => {
      eventSource.close();
    };
  }, [router]);
}
