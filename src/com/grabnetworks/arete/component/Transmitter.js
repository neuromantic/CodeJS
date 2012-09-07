/*!
 *
 * Transmitter.js
 * com.grabnetworks.arete.component.Transmitter
 *
 */
_package( 'com.grabnetworks.arete',
	
 	_import( 'com.grabnetworks.arete.component.Processor' ),
 	
	_class( 'Transmitter' )._extends( 'Processor', {
		private_connections : [],
		output : function( message ) {
			message.source = this;
			message.route.push( this );
			for ( var i = 0; i < this._.connections.length; i++ ) {
				var receiver = this._.connections[ i ];
				receiver.input(message);
			}
			this._.message = {};
		}
	} )
);