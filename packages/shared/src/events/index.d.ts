export interface DomainEvent {
    type: string;
    payload: Record<string, unknown>;
    occurredAt: string;
}
export interface EventPublisher {
    publish(event: DomainEvent): Promise<void>;
}
export declare class InMemoryEventPublisher implements EventPublisher {
    private readonly events;
    publish(event: DomainEvent): Promise<void>;
    getEvents(): DomainEvent[];
    clear(): void;
}
export declare const createOrderCreatedEvent: (payload: Record<string, unknown>) => DomainEvent;
export declare const createOrderStatusUpdatedEvent: (payload: Record<string, unknown>) => DomainEvent;
