/*!
 *
 * Processor.js
 * com.neuromantic.arete.component.Processor
 *
 */
_package( 'com.neuromantic.arete.component',
	
	_import('com.neuromantic.arete.component.Receiver'),
	
	_class( 'Processor' )._extends( 'Receiver', {
		process : function( message ){
			if( message.origin !== this ){
				this.output( message );
			}
			this._super().process( message );
		},
		output : function ( message ) {
_debug(this, '.output' );
		}
	})
)
		