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
 // _package( 'com.fasejs.events',
	_class('EventDispatcher', {
		private_eventHandlers : {},
		z_eventClosures : new Dictionary(),
		addEventListener : function(eventType, eventHandler, scope) {
			scope = scope || this;
// _trace( this, 'adding', eventType, 'event scope:', scope),
			this._.eventHandlers[ eventType ] = this._.eventHandlers[eventType] || [];
			var closure = ( function( scope ) {
				 return function ( event ) {
// _trace( 'handling event', event.type)
				 	 eventHandler.apply( scope, [ event ] ); 
				 }
			} )( scope )
			this.z_eventClosures._(eventHandler, closure )
			this._.eventHandlers[ eventType ].push( closure );
		},
		removeEventListener : function( eventType, eventHandler ) {
			if( this._.eventHandlers[ eventType ].length > 0 ) {
				var index = this._.eventHandlers[ eventType ].indexOf( this.z_eventClosures._(eventHandler) );
				if( index > -1 ) {
					this._.eventHandlers[ eventType ].splice( index, 1 );
					this.z_eventClosures._( eventHandler, null );
				};
			};
		},
		_dispatchEvent : function( event ) {
			if( this._.eventHandlers[ event.type ] ) {
				event.target = this;
				for( index in this._.eventHandlers[ event.type ] ) {
					this._.eventHandlers[ event.type ][ index ]( event );
				};
			};
		}//,
	}
);
