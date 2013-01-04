/*!
 *
 * Notifier.js
 * com.neuromantic.arete.events.Notifier
 *
 */
 _package( 'com.neuromantic.arete.events',
 	
	_class('Notifier', {
		Notifier : function () {
		},
		private_handlers : {},
		on : function(eventType, eventHandler, scope) {
			this._.handlers[ eventType ] = this._.handlers[ eventType ] || [];
			scope = scope || this;
			this._.eventHandlers[ eventType ].push( Code.utils.scope( eventHandler, scope) );
		},
		off : function( eventType, eventHandler ) {
			if( this._.handlers[ eventType ].length > 0 ) {
				var index = this._.eventHandlers[ eventType ].indexOf( eventHandler);
				if( index > -1 ) {
					this._.handlers[ eventType ].splice( index, 1 );
				};
			};
		},
		private_notify : function( event ) {
			if( this._.handlers[ event.type ] ) {
				event.target = this;
				for( var index in this._.handlers[ event.type ] ) {
					this._.handlers[ event.type ][ index ]( event );
				};
			};
		}//,
	})
);
