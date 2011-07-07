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
// _debug( 'new EventDispatcher' )
			// this._.eventClosures = new Dictionary();
// _debug( 'EventDispatcher constructed.')
		},
		private_eventHandlers : {},
		private_eventClosures : null,
		addEventListener : function(eventType, eventHandler, scope) {
			this._.eventHandlers[ eventType ] = this._.eventHandlers[ eventType ] || [];
			// scope = scope || this;
			// var closure = ( function( scope ) {
				 // return function ( event ) {
				 	 // eventHandler.apply( scope, [ event ] ); 
				 // }
			// } )( scope )
			// this._.eventClosures._(eventHandler, closure )
			this._.eventHandlers[ eventType ].push( eventHandler );
			
// _debug( this, this._.eventClosures);
		},
		removeEventListener : function( eventType, eventHandler ) {
			if( this._.eventHandlers[ eventType ].length > 0 ) {//this._.eventClosures._(
				var index = this._.eventHandlers[ eventType ].indexOf( eventHandler);// );
				if( index > -1 ) {
					this._.eventHandlers[ eventType ].splice( index, 1 );
					// this._.eventClosures._( eventHandler, null );
				};
			};
		},
		_dispatchEvent : function( event ) {
			if( this._.eventHandlers[ event.type ] ) {
				event.target = this;
				for( index in this._.eventHandlers[ event.type ] ) {
					// this._.eventClosures._( 
					this._.eventHandlers[ event.type ][ index ]( event );
				};
			};
		}//,
	})
);
