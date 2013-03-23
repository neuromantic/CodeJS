/*!
 *
 * TimerEvent.js
 * com.neuromantic.arete.events.TimerEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.neuromantic.arete.events',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
 	
	_class( 'TimerEvent' )._extends( 'Event', {
		static_START : 'timerStart',
		static_STOP : 'timerStop',
		static_TICK : 'timerTick',
		static_COMPLETE : 'timerComplete',
		static_RESET : 'timerReset'//,
	})
);