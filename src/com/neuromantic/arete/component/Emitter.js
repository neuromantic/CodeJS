/*!
 *
 * Emitter.js
 * com.neuromantic.arete.component.Emitter
 *
 */
_package( 'com.neuromantic.arete',
 	
	_import( 'com.neuromantic.arete.component.Transmitter' ),

	_class( 'Emitter' )._extends( 'Transmitter', {
		emit : function( message ) {
_debug(this, '.emit(', message, ')' );
			message.origin = this;
			message.route = [];
			this.output( message );
		}
	} )
);