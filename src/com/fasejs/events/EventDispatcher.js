/*!
 *
 * EventDispatcher.js
 * com.fasejs.events.EventDispatcher
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.fasejs.events',
 
 	_import('com.fasejs.util.Dictionary' ),
 	
	_class('EventDispatcher', {
		EventDispatcher : function () {
			this._.eventClosures = new Dictionary();
		},
		private_eventHandlers : {},
		private_eventClosures : null,
		addEventListener : function(eventType, eventHandler, scope) {
			scope = scope || this;
			this._.eventHandlers[ eventType ] = this._.eventHandlers[eventType] || [];
			var closure = ( function( scope ) {
				 return function ( event ) {
				 	 eventHandler.apply( scope, [ event ] ); 
				 }
			} )( scope )
			this._.eventClosures._(eventHandler, closure )
			this._.eventHandlers[ eventType ].push( eventHandler );
			
_debug( this, this._.eventClosures);
		},
		removeEventListener : function( eventType, eventHandler ) {
			if( this._.eventHandlers[ eventType ].length > 0 ) {
				var index = this._.eventHandlers[ eventType ].indexOf( this._.eventClosures._(eventHandler) );
				if( index > -1 ) {
					this._.eventHandlers[ eventType ].splice( index, 1 );
					this._.eventClosures._( eventHandler, null );
				};
			};
		},
		_dispatchEvent : function( event ) {
			if( this._.eventHandlers[ event.type ] ) {
				event.target = this;
				for( index in this._.eventHandlers[ event.type ] ) {
					this._.eventClosures._( this._.eventHandlers[ event.type ][ index ])( event );
				};
			};
		}//,
	})
);
