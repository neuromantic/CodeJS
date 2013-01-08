/*!
 *
 * LoadingEvent.js
 * com.neuromantic.arete.events.LoadingEvent
 *
 */
 _package( 'com.neuromantic.arete.events',
    _import( 'com.neuromantic.arete.events.Event'),
    _class('LoadingEvent')._extends( 'Event', {
		static_LOADED : 'loaded',
        static_PROGRESS : 'progress'//,
	})
);
