/* eslint-env jasmine */

import Events from './events.js';

describe('Event Dispatcher', function() {

    let events;
    beforeEach(function() {
        events = new Events();
    });

    it('is a function', function() {
        expect(typeof Events).toBe('function');
    });

    it('can register a callback', function() {
        events.on('foo', function() {});
    });

    // This doesn't add any value since extra arguments do not throw an exception.
    // Additionally, this test is handled in the 'can trigger an event registered with a scope' test.
    // it('can register a callback with a scope', function() {
    //     events.on('foo', function() {}, this);
    // });

    it('can trigger an event', function() {
        const listener = jasmine.createSpy('listener');
        events.on('foo', listener);

        events.trigger('foo');

        expect(listener).toHaveBeenCalled();
    });

    it('can trigger an event registered with scope', function(done) {
        const scope = {};

        events.on('foo', function() {
            expect(this).toBe(scope);
            done();
        }, scope);

        events.trigger('foo');
    });

    it('can trigger an event with arguments', function() {
        const listener = jasmine.createSpy('listener');
        events.on('foo', listener);

        events.trigger('foo', 'bar', 'baz');

        expect(listener).toHaveBeenCalledWith('bar', 'baz');
    });

    it('can trigger multiple callbacks on an event', function() {
        const listener1 = jasmine.createSpy('listener1');
        const listener2 = jasmine.createSpy('listener2');
        events.on('foo', listener1);
        events.on('foo', listener2);

        events.trigger('foo');

        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
    });

    it('can remove callbacks from an event', function() {
        const listener = jasmine.createSpy('listener');
        events.on('foo', listener);

        events.trigger('foo');
        expect(listener).toHaveBeenCalled();

        events.off('foo');
        events.trigger('foo');
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('can remove a specific callback from an event', function() {
        const listener1 = jasmine.createSpy('listener1');
        const listener2 = jasmine.createSpy('listener2');
        events.on('foo', listener1);
        events.on('foo', listener2);

        events.trigger('foo');
        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();

        events.off('foo', listener1);
        events.trigger('foo');
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);
    });

    it('can remove a specific callback registered with a scope from an event', function() {
        const listener1 = jasmine.createSpy('listener1');
        const listener2 = jasmine.createSpy('listener2');

        const scope1 = {};
        const scope2 = {};

        events.on('foo', listener1, scope1);
        events.on('foo', listener2, scope2);

        events.trigger('foo');
        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();

        events.off('foo', listener1);
        events.trigger('foo');
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(2);
    });

    // Additional tests

    it('can trigger the same callback with different scopes', function() {
        const listener = jasmine.createSpy('listener');

        const scopes = [{}, {}];

        scopes.forEach(function(scope) {
            events.on('foo', listener, scope);
        });

        events.trigger('foo');

        listener.calls.all().forEach(function (call, index) {
            expect(call.object).toBe(scopes[index]);
        });
    });

    it('does not trigger the same callback registered twice', function() {
        const listener = jasmine.createSpy('listener1');

        events.on('foo', listener);
        events.on('foo', listener);

        events.trigger('foo');

        expect(listener.calls.count()).toEqual(1);
    });
});
