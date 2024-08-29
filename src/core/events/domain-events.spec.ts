import { DomainEvent } from '../events/domain-event'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvents } from '@/core/events/domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()

    // Subscriber registered (listening to the 'answer created' event in case of forum)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // I am creating an answer but WITHOUT saving it to the database
    const aggregate = CustomAggregate.create()

    // I am ensuring that the event was created but NOT triggered
    expect(aggregate.domainEvents).toHaveLength(1)

    // I am saving the answer to the database and thus triggering the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The subscriber listens to the event and does what needs to be done with the data
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
