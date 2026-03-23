type Listener = (event: string, data?: string) => void;

const globalForEmitter = globalThis as unknown as {
  sseEmitter: {
    listeners: Set<Listener>;
    emit: (event: string, data?: string) => void;
    subscribe: (listener: Listener) => () => void;
  };
};

if (!globalForEmitter.sseEmitter) {
  const listeners = new Set<Listener>();

  globalForEmitter.sseEmitter = {
    listeners,
    emit(event: string, data?: string) {
      listeners.forEach((listener) => listener(event, data));
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const emitter = globalForEmitter.sseEmitter;
