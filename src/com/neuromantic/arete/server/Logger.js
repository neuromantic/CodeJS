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
		process : function ( message ) {
			if( message.http ) {
				console.log( message.http.req.url );
			}
			this._super.process( message );
			
		}//,
	})
)
		