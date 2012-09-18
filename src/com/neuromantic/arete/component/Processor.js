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
//_debug(this, 'process(',  message.origin , ')');
			this.output( message );
		},
		output : function ( message ) {
		}
	})
)
		