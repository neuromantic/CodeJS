/*!
 *
 * Logger.js
 * com.grabnetworks.arete.Logger
 *
 */
_package( 'com.grabnetworks.arete.server',
 	_import( 'com.grabnetworks.arete.component.Component' ),
	_class( 'Logger' )._extends( 'Component', {
		Logger : function( ) {
		},
		process : function ( message ) {
			if( message.http ) {
				console.log(message.http.req.url)
			}
			this.output( message );
		}//,
	})
)
		