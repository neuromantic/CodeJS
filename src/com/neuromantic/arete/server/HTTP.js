/*!
 *
 * HTTP.js
 * com.neuromantic.arete.server.HTTP
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'HTTP' )._extends( 'Component', {
		private_server: null,
		private_listen : function ( location ){
			this._.server = require('http').createServer(this._.handleRequest);
			if(location.host && location.port ){
				this._.server.listen(  location.port, location.host );
				this.emit( { log:  'HTTP listening at host ' + location.host + ' on port ' + location.port } );
			}
		},
		private_handleRequest: function( req, res ) {
			this.emit( { request : { req: req, res: res } } );
		},
		config : function ( config ) {
			if(config.http){
				this._.listen( config.http );
			}
		},
		process : function ( message ){
			if ( message.request ) {
				return message.request.res.end();
			}else if ( message.location ){
				return this._.listen( message.location );
			}
			this._super().process( message );
		}//, 
	})
);