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
 
_class('EventDispatcher', {
	private_eventHandlers : {},
	addEventListener : function(eventType, eventHandler) {
		this._.eventHandlers[ eventType ] = this._.eventHandlers[eventType] || [];
		this._.eventHandlers[ eventType ].push( eventHandler );
	},
	removeEventListener : function( eventType, eventHandler ) {
		if( this._.eventHandlers[ eventType ].length > 0 ) {
			var index = this._.eventHandlers[ eventType ].indexOf( eventHandler );
			if( index > -1 ) {
				this.eventHandlers[ eventType ].splice( index, 1 );
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
});
