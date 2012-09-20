/*!
 *
 * Receiver.js
 * com.neuromantic.arete.component.Receiver
 *
 */
_package( 'com.neuromantic.arete.component',
	_class( 'Receiver', {
		private_message : {},
		Receiver: function ( config ){
_debug( this, 'config = ', JSON.stringify( config ) );
			if(config){
				this.config( config );
			}
		},
		config : function( config ){
		},
		input : function ( message ) {
			this._.message = message;
			if(message.config){
				this.config( message.config )
			}
			this.process ( message );
		},
		process : function ( message ) {
		}//,
	})
)
		