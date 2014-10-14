/* jshint unused:false */

// Importing Ember
import Ember from 'ember';

// Importing Calendar resources
import CalendarRangeStoreMixin from 'ember-cli-cal/mixins/range-store';
import CalendarEventStoreMixin from 'ember-cli-cal/mixins/event-store';
import CalendarTools from 'ember-cli-cal/utilities/calendartools';

// Your controller should extend CalendarRangeStoreMixin and CalendarEventStoreMixin
// CalendarEventStoreMixin offers convenient routines to store and merge calendar events efficiently
// CalendarRangeStoreMixin handles date-ranges, and determines if a range has already been fetched or not (useful for AJAX event sources)
export default Ember.Controller.extend(CalendarRangeStoreMixin, CalendarEventStoreMixin, {

    // this holds the reference to the calendar component
    calendar: null,

    // the selected event, if any
    selectedEvent: null,

    // class binding to handle the "Selected event tab" in the view
    displayClass: (function() {
        if (this.get('selectedEvent')) { return 'col-sm-9'; }
        return 'col-sm-12';
    }).property('selectedEvent'),

    actions: {

        // Called when a calendar event is selected
        // It's the controller responsibility to do something with the selected calendar event
        // Here, we inform the event that it's active, so that depending views may update (color changes, notably)
        eventSelected: function(event) {
            this.set('selectedEvent', event);
            this.get('selectedEvent').set('active', true);
            return false;
        },

        // Called when a calendar event is unselected
        eventUnselected: function() {
            this.get('selectedEvent').set('active', false);
            this.set('selectedEvent', false);
            return false;
        },

        // Called when the "Close" button is clicked for the selected event
        // This action is initialized by our controller, not by the calendar component
        closeEvent: (function() {
            return this.calendar.unselectEvent();
        }),

        // Called when the displayed month changes
        // Our controller should fetch calendar events to respond to this
        viewChanged: function(range, oldrange) {

            if (this.isRangeFetched(range)) {
                // CalendarRangeStoreMixin says that this range has been fetched already
                // We do nothing
                return;
            } else {
                // CalendarRangeStoreMixin says that this range has NOT already been fetched
                // We aggregate the range to the already fetched range, to keep track of this
                this.aggregateRange(range);
            }

            // We have to fetch events
            // In this demo, events are generated randomly, but you could as well fetch them asynchronously from an API

            var randomEvents = [];
            var getRandomInt = function(min, max) { return Math.floor(Math.random() * (max - min)) + min;};

            for (var i = 1; i <= 5; i++) {
                var randomstart = range.start.clone().add(getRandomInt(0, 30), 'days').hour(0).minute(0).second(0).millisecond(0);
                var randomend = randomstart.clone().add(getRandomInt(1, 9), 'days');

                // The calendar component uses a proxy Event model, defining only the property used for display in the calendar view
                // You may associate this DisplayedEvent proxy and your own Event model using the `payload` property of the proxy (see below)
                randomEvents.push(CalendarTools.DisplayedEvent.create({
                    start: randomstart,
                    end: randomend,
                    label: 'Some random event !',
                    payload: null   // If events were fetched by an API, this is where your would put your own event model
                }));
            }

            // Use CalendarEventStoreMixin to merge the fetched events with the ones already fetched
            return this.mergeEvents(randomEvents);
        }
    }
});
