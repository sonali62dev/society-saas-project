'use client'

type EventCallback = (...args: any[]) => void;

class MockSocket {
  connected: boolean = true;
  id: string = 'mock-socket-id';

  private listeners: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event: string, callback?: EventCallback) {
    if (!this.listeners[event]) return this;
    if (!callback) {
      delete this.listeners[event];
    } else {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }

  emit(event: string, ...args: any[]) {
    return this;
  }

  connect() {
    this.connected = true;
    if (this.listeners['connect']) {
      this.listeners['connect'].forEach(cb => cb());
    }
    return this;
  }

  disconnect() {
    this.connected = false;
    if (this.listeners['disconnect']) {
      this.listeners['disconnect'].forEach(cb => cb());
    }
    return this;
  }
}

let socketInstance: MockSocket | null = null;

export const getSocket = (): any => {
  if (!socketInstance) {
    socketInstance = new MockSocket();
  }
  return socketInstance;
};

export const connectSocket = (societyId: number | string) => {
  const s = getSocket();
  s.connect();
  return s;
};

export const connectPlatformAdmin = () => {
  const s = getSocket();
  s.connect();
  return s;
};

export const connectUser = (userId: number | string) => {
  const s = getSocket();
  s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

