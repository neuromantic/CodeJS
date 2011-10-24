/*!
 *
 * MouseEvent.js
 * com.fasejs.events.MouseEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.events',
 
 	_import( 'com.fasejs.events.Event' ),
 	
	_class('MouseEvent')._extends('Event', {
		static_mouseX : function ( e ) {
			var x = 0;
			if ( !e ){
				var e = window.event;
			} 
			if ( e.pageX) {
				x = e.pageX;
			} else if ( e.clientXY ) {
				x = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			};
			return x
		},
		static_mouseY : function ( e ) {
			var y = 0;
			if (!e) var e = window.event;
			if (e.pageY) 	{
				y = e.pageY;
			}
			else if (e.clientXY) {
				y = e.clientY + document.body.scrollTop;
				+ document.documentElement.scrollTop;
			}
			return y
		},
		static_CLICK : 'click',
		static_ROLL_OVER : 'rollOver',
		static_ROLL_OUT : 'rollOut',
		static_MOVE : 'mouseMove',
		static_MOUSE_OVER : 'mouseOver',
		static_MOUSE_OUT : 'mouseOut',
		mouseX : 0,
		mouseY : 0,
		MouseEvent : function ( type, target, mouseX, mouseY ){
			this._super( type, target );
			this.mouseX = mouseX;
			this.mouseY = mouseY;
		}
	})
);