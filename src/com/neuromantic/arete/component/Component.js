/*!
 *
 * Component.js
 * com.neuromantic.arete.component.Component
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Emitter' ),
 	
	_class( 'Component' )._extends( 'Emitter', {
		connect : function( intake ) {
			this._.connections.push( intake );
		},
		disconnect : function ( intake ){
			this._.connections.splice( this._.connections.indexOf( input ), 1 );
		}
	} )
);