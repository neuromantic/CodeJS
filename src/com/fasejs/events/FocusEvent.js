/*!
 *
 * FocusEvent.js
 * com.fasejs.events.FocusEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
  _package( 'com.fasejs.events',
 
 	_import( 'com.fasejs.events.Event' ),
 	
	_class('FocusEvent')._extends('Event', {
		static_IN : 'focusIn',
		static_OUT : 'focusOut',
	})
);