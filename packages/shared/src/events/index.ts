export interface DomainEvent {
  type: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export class InMemoryEventPublisher implements EventPublisher {
  private readonly events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }

  getEvents() {
    return [...this.events];
  }

  clear() {
    this.events.length = 0;
  }
}

export const createOrderCreatedEvent = (payload: Record<string, unknown>): DomainEvent => ({
  type: 'order.created',
  payload,
  occurredAt: new Date().toISOString(),
});

export const createOrderStatusUpdatedEvent = (
  payload: Record<string, unknown>
): DomainEvent => ({
  type: 'order.status_updated',
  payload,
  occurredAt: new Date().toISOString(),
});

