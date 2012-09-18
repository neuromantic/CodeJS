/*!
 *
 * Logger.js
 * com.neuromantic.arete.Logger
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Logger' )._extends( 'Component', {
		process : function ( message ) {
			if( message.log ){
				_debug( 'LOG:', message.log  );
			}
			if( message.request ){
				_debug( 'HTTP:', message.request.req.url  );
			}
			this._super().process( message );
		}//,
	})
)
		