/*!
 *
 * Logger.js
 * com.neuromantic.arete.Server
 *
 */
_package( 'com.neuromantic.arete',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Server' )._extends( 'Component', {
		private_http: null,
		Server: function( config ) {
			this._.http = require('http').createServer(this._.handleRequest);
			this._.listen( config );
		},
		private_listen : function ( location ){
			if(location.host && location.port ){
				this._.http.listen(  location.port, location.host )
				console.log( 'server listening at', location.host, 'on port', location.port )
			}
		},
		private_handleRequest: function( req, res ) {
			this.emit( { http: { req: req, res: res } } );
		},
		process : function ( message ){
			if ( message.http ) {
				return message.http.res.end();
			}else if ( message.location ){
				return this._.listen( message.location );
			}
			this.output( message )
			
		}//, 
	})
);