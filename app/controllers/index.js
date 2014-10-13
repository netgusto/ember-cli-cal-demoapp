/* jshint unused:false */

import Ember from 'ember';
import CalendarRangeStoreMixin from 'ember-cal/mixins/range-store';
import CalendarEventStoreMixin from 'ember-cal/mixins/event-store';
import CalendarTools from 'ember-cal/utilities/calendartools';

export default Ember.Controller.extend(CalendarRangeStoreMixin, CalendarEventStoreMixin, {
    calendar: null,
    selectedEvent: null,
    displayClass: (function() {
        if (this.get('selectedEvent')) {
            return 'col-sm-9';
        }
        return 'col-sm-12';
    }).property('selectedEvent'),
    actions: {
        eventSelected: function(event) {
            this.set('selectedEvent', event);
            this.get('selectedEvent').set('active', true);
            return false;
        },
        eventUnselected: function() {
            this.get('selectedEvent').set('active', false);
            this.set('selectedEvent', false);
            return false;
        },
        viewChanged: function(range, oldrange) {
            var getRandomInt, i, randomEvents, randomend, randomstart, _i;
            if (this.isRangeFetched(range)) {
                return;
            } else {
                this.aggregateRange(range);
            }
            randomEvents = [];
            getRandomInt = function(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            };
            for (i = _i = 1; _i <= 5; i = ++_i) {
                randomstart = range.start.clone().add(getRandomInt(0, 30), 'days').hour(0).minute(0).second(0).millisecond(0);
                randomend = randomstart.clone().add(getRandomInt(1, 9), 'days');
                randomEvents.push(CalendarTools.DisplayedEvent.create({
                    start: randomstart,
                    end: randomend,
                    label: 'Some random event !',
                    payload: null
                }));
            }
            return this.mergeEvents(randomEvents);
        },
        closeEvent: (function() {
            return this.calendar.unselectEvent();
        })
    }
});
