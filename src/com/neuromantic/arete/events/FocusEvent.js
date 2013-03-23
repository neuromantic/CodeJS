/*!
 *
 * FocusEvent.js
 * com.neuromantic.arete.events.FocusEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
  _package( 'com.neuromantic.arete.events',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('FocusEvent')._extends('Event', {
		static_IN : 'focusIn',
		static_OUT : 'focusOut',
	})
);