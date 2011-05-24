/*!
 *
 * TimerEvent.js
 * com.fasejs.events.TimerEvent
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.fasejs.events',
 
 	// _import( 'com.fasejs.events.Event' ),
 	
	_class('TimerEvent')._extends('Event', {
		static_START : 'timerStart',
		static_STOP : 'timerStop',
		static_TIMER : 'timer',
		static_COMPLETE : 'timerComplete',
		static_RESET : 'timerReset'
	}
);