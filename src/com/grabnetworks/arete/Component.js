/*!
 *
 * Component.js
 * com.grabnetworks.arete.Component
 *
 */
_package( 'com.grabnetworks.arete',
	
 	_import( 'com.grabnetworks.arete.Emitter' ),
 	
	_class( 'Component' )._extends( 'Emitter', {
		connect : function( intake ) {
			this._.connections.push( intake );
		},
		disconnect : function ( intake ){
			this._.connections.splice( this._.connections.indexOf( input ),1 );
		}
	} )
);