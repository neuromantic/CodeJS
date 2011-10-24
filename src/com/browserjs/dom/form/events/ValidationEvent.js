/*!
 *
 * ValidationEvent.js
 * ValidationEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
  _package( 'com.fasejs.events',
 
 	_import( 'com.fasejs.events.Event' ),
	_class('ValidationEvent')._extends('Event', {
		static_VALID : 'valid',
		static_VOID : 'void'
	})//,
);