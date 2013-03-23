/*!
 *
 * Logger.js
 * com.neuromantic.arete.server.Logger
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Logger' )._extends( 'Component', {
        Logger : function (settings){
            this._super( settings );
        },
		process : function ( message ) {
			if( message.log ){
				_trace( 'LOG:', message.log  );
			}
			if( message.request ){
				_trace( 'HTTP:', message.request.req.url  );
			}
			this._super().process( message );
		}//,
	})
);		