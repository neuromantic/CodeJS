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
			if(config){
				this._.listen( config );
			}
		},
		private_listen : function ( location ){
			this._.http = require('http').createServer(this._.handleRequest);
			if(location.host && location.port ){
				this._.http.listen(  location.port, location.host );
				this.emit( { log:  'server listening at' + location.host + 'on port' + location.port } );
			}
		},
		private_handleRequest: function( req, res ) {
			this.emit( { request : { req: req, res: res } } );
		},
		process : function ( message ){
			if( message.config && message.config.server ) {
				this._.listen( message.config.server );
			}
			if ( message.http ) {
				return message.http.res.end();
			}else if ( message.location ){
				return this._.listen( message.location );
			}
			this._super().process( message );
		}//, 
	})
);