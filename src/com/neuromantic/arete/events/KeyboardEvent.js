/*!
 *
 * KeyboardEvent.js
 * com.neuromantic.arete.events.KeyboardEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.neuromantic.arete.events',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('KeyboardEvent')._extends('Event', {
		static_PRESS : 'keyPress',
		static_UP : 'keyUp',
		static_DOWN : 'keyDown'
	})
);