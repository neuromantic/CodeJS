/*!
 *
 * Receiver.js
 * com.neuromantic.arete.component.Receiver
 *
 */
_package( 'com.neuromantic.arete.component',
	_class( 'Receiver', {
		private_message : {},
		Receiver: function (){
		},
		input : function ( message ) {
_debug(this, '.input(', message, ')' );
			this._.message = message;
			this.process ( message );
		},
		process : function ( message ) {
_debug(this, '.process(', message, ')' );
		}//,
	})
)
		