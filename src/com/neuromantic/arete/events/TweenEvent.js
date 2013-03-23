/*!
 *
 * TweenEvent.js
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
	_class('TweenEvent')._extends('Event', {
		static_START : 'tweenStart',
		static_STOP : 'tweenStop',
		static_UPDATE : 'tweenUpdate',
		static_UPDATING : 'tweenUpdating',
		static_COMPLETE : 'tweenComplete'
	}
));