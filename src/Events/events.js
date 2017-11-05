class Events {
    events = {};

    // Register a trigger for an event
    // If the callback/scope already exists, do not add it again.
    on = (name, callback, scope) => {
        const event = this.events[name];
        const trigger = { callback, scope };

        if (event) {
            const hasTrigger = event.triggers.find((trigger) => (
                trigger.callback === callback && trigger.scope === scope)
            );

            if (hasTrigger) {
                return;
            }

            // Maintain immutability
            this.events[name] = { name, triggers: [...event.triggers, trigger] };
            return;
        }

        this.events[name] = { name, triggers: [trigger] };
    };

    // Unregister triggers for an event
    off = (name, callback, scope) => {
      // Maintain immutability
      this.events = Object.values(this.events).reduce((newEvents, event) => {
          if (event.name !== name) {
              newEvents[name] = event;
              return newEvents;
          }

          if (callback) {
              // Filter out triggers that match the callback and scope (if specified)
              const triggers = event.triggers.filter((trigger) => (
                  trigger.callback !== callback && (!scope || scope !== trigger.scope)
              ));

              if (triggers.length > 0) {
                  newEvents[name] = { ...event, triggers };
              }
          }

          return newEvents;
      }, {});
    };

    // Trigger callbacks
    trigger = (name, ...args) => {
      const event = this.events[name];

      if (event) {
          event.triggers.forEach(eventTrigger => eventTrigger.callback.call(eventTrigger.scope, ...args));
      }
    };
}

export default Events;
