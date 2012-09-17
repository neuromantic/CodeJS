/*!
 *
 * Logger.js
 * com.neuromantic.arete.Logger
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Logger' )._extends( 'Component', {
		Logger : function( ) {
		},
		private_log : function ( ) {
			_debug.apply( arguments );
		},
		process : function ( message ) {
//			this._.log( JSON.stringify( message ) );
			this._super().process( message );
		}//,
	})
)
		