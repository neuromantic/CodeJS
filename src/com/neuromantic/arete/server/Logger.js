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
			if( message.http ) {
				this._.log( 'HTTP REQUEST:', message.http.req.url );
			}
			if(message.log){
				this._.log( 'LOG', message.log );
			}
			this._super.process( message );
			
		}//,
	})
)
		