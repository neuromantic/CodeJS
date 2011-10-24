/*!
 *
 * TweenEvent.js
 * com.fasejs.events.TimerEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.events',
 	_import( 'com.fasejs.events.Event' ),
	_class('TweenEvent')._extends('Event', {
		static_START : 'tweenStart',
		static_STOP : 'tweenStop',
		static_UPDATE : 'tweenUpdate',
		static_UPDATING : 'tweenUpdating',
		static_COMPLETE : 'tweenComplete'
	}
));