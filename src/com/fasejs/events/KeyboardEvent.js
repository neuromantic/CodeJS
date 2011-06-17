/*!
 *
 * KeyboardEvent.js
 * com.fasejs.events.KeyboardEvent
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.events',
 
 	_import( 'com.fasejs.events.Event' ),
 	
	_class('KeyboardEvent')._extends('Event', {
		
		static_PRESS : 'keyPress',
		static_UP : 'keyUp',
		static_DOWN : 'keyDown',
		mouseX : 0,
		mouseY : 0,
		KeyboardEvent : function ( type, target ){
			this._super( type, target );
		}
	})
);