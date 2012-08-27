/*!
 *
 * Component.js
 * com.grabnetworks.arete.component.Emitter
 *
 */
_package( 'com.grabnetworks.arete',
 	
	_import( 'com.grabnetworks.arete.component.Transmitter' ),

	_class( 'Emitter' )._extends( 'Transmitter', {
		emit : function( message ) {
			message.origin = this;
			message.route = [];
			this.output( message );
		}
	} )
);