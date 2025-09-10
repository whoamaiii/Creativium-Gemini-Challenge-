export interface ToastMessage {
  id: number;
  text: string;
}

type Subscriber = (messages: ToastMessage[]) => void;

class ToastService {
  private messages: ToastMessage[] = [];
  private subscribers: Set<Subscriber> = new Set();
  private nextId = 0;

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    callback(this.messages); // Immediately notify with current messages
    return () => this.subscribers.delete(callback);
  }

  show(text: string) {
    const newMessage: ToastMessage = { id: this.nextId++, text };
    this.messages = [...this.messages, newMessage];
    this.notify();

    // Auto-dismiss after a delay, matching the component's timer
    setTimeout(() => {
      this.messages = this.messages.filter(msg => msg.id !== newMessage.id);
      this.notify();
    }, 2600);
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.messages));
  }
}

export const toastService = new ToastService();
