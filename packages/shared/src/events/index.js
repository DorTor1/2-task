"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderStatusUpdatedEvent = exports.createOrderCreatedEvent = exports.InMemoryEventPublisher = void 0;
class InMemoryEventPublisher {
    constructor() {
        this.events = [];
    }
    async publish(event) {
        this.events.push(event);
    }
    getEvents() {
        return [...this.events];
    }
    clear() {
        this.events.length = 0;
    }
}
exports.InMemoryEventPublisher = InMemoryEventPublisher;
const createOrderCreatedEvent = (payload) => ({
    type: 'order.created',
    payload,
    occurredAt: new Date().toISOString(),
});
exports.createOrderCreatedEvent = createOrderCreatedEvent;
const createOrderStatusUpdatedEvent = (payload) => ({
    type: 'order.status_updated',
    payload,
    occurredAt: new Date().toISOString(),
});
exports.createOrderStatusUpdatedEvent = createOrderStatusUpdatedEvent;
//# sourceMappingURL=index.js.map