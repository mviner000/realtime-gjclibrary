// websocketService.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // Start with 1 second
  private messageHandlers: ((data: any) => void)[] = [];

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connection established");
        this.reconnectAttempts = 0;
        this.reconnectTimeout = 1000; // Reset timeout on successful connection
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(data));
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.warn("WebSocket error:", error);
        // Don't close the connection here - let onclose handle it
      };
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      // Exponential backoff
      setTimeout(() => {
        this.connect();
      }, this.reconnectTimeout);

      // Increase reconnect timeout for next attempt (max 30 seconds)
      this.reconnectTimeout = Math.min(this.reconnectTimeout * 2, 30000);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  public addMessageHandler(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: (data: any) => void) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  public sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
