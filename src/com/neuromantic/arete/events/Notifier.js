/*!
 *
 * Notifier.js
 * com.neuromantic.arete.events.Notifier
 *
 */
 _package( 'com.neuromantic.arete.events',
	_class('Notifier', {
    	private_notify : function( event ) {
			if( this._.handlers[ event.type ] ) {
				event.target = this;
				for( var index in this._.handlers[ event.type ] ) {
					this._.handlers[ event.type ][ index ]( event );
				}
			}
		},
		Notifier : function () {
		},
		private_handlers : {},
		on : function( eventType, eventHandler ) {
			this._.handlers[ eventType ] = this._.handlers[ eventType ] || [];
			this._.handlers[ eventType ].push( eventHandler );
		},
		off : function( eventType, eventHandler ) {
			if( this._.handlers[ eventType ] ) {
                if( eventHandler === undefined ){
                    return delete this._.handlers[ eventType ];
                }
				var index = this._.handlers[ eventType ].indexOf( eventHandler);
				if( index > -1 ) {
					this._.handlers[ eventType ].splice( index, 1 );
				}
			}
		}//,
	})
);
