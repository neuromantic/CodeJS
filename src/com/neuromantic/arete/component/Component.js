/*!
 *
 * Component.js
 * com.neuromantic.arete.component.Component
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Emitter' ),
 	
	_class( 'Component' )._extends( 'Emitter', {
		connect : function( receiver ) {
//_debug( this, 'connect(', receiver, ')' );
			this._.connections.push( receiver );
		},
		disconnect : function ( receiver ){
			this._.connections.splice( this._.connections.indexOf( receiver ), 1 );
		}
	} )
);