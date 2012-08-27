/*!
 *
 * Component.js
 * com.grabnetworks.arete.component.Component
 *
 */
_package( 'com.grabnetworks.arete.component',
	
 	_import( 'com.grabnetworks.arete.component.Emitter' ),
 	
	_class( 'Component' )._extends( 'Emitter', {
		connect : function( intake ) {
			this._.connections.push( intake );
		},
		disconnect : function ( intake ){
			this._.connections.splice( this._.connections.indexOf( input ), 1 );
		}
	} )
);