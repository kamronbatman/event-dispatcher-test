var Events = require('./events');

describe("Event Dispatcher", function() {
    it("is an object", function() {

        expect(typeof Events).toBe("object");
    });

    xit("can register a callback", function() {
        Events.on('foo', function() {
            return 'bar';
        });
    });

    xit("can register a callback with a scope", function() {
        Events.on('foo', function() {
            return 'bar';
        }, this);
    });

    xit("can trigger an event", function() {
        var bar = 1;

        Events.on('foo', function() {
            bar = 2;
        });

        Events.trigger('foo');

        expect(bar).toBe(2);
    });

    xit("can trigger an event with arguments", function() {
        var bar = 1;

        Events.on('foo', function(v) {
            bar = v;
        });

        Events.trigger('foo', 5);

        expect(bar).toBe(5);
    });

    xit("can trigger multiple callbacks on an event", function() {

        (function() {
            var baz = 'HauteLook';
            
            Events.on('foo', function() {
                expect(baz).toBe('Nordstomrack');
            });

            baz = 'Nordstomrack';
        })();

        var bar = 1;
        Events.on('foo', function() {
            bar = 2;
        });

        Events.trigger('foo');
        expect(bar).toBe(2);
    });

    xit("can remove callbacks from an event", function() {
        var bar = 1;

        Events.on('foo', function() {
            bar += 1;
        });

        Events.trigger('foo');
        Events.off('foo');
        Events.trigger('foo');
        expect(bar).toBe(2);
    });

    xit("can remove specific callbacks from an event", function() {
        var bar = 1;

        var adder = function(v) {
            bar += v;
        };

        var multiplier = function(v) {
            bar *= v;
        };

        Events.on('foo', adder);
        Events.trigger('foo', 1);
        expect(bar).toBe(2);

        Events.on('foo', multiplier)
        Events.off('foo', adder);
        Events.trigger('foo', 100);
        expect(bar).toBe(200);
    });
});
