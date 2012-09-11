/*!
 *
 * Socket.js
 * com.neuromantic.arete.Socket
 *
 */
_package( 'com.neuromantic.arete',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Socket' )._extends( 'Component', {
		private_http: null,
		private_events: [],
		Server: function( config ) {
			if( typeof require === 'function' ){
				require('socket.io').sockets.on('connection', this.connect )
			}
		},
		private_accept : function( eventName ) {
			if( this._events.indexOf( eventName ) + 1 ){
				this._.events.push( eventName );
			}
		},
		private_connect : function ( socket ){
			for(var n = 0; n < this._.events.length; n ++ ){
				var event = this._.events[n];
				socket.on( event, this._.getRepeater( event, socket ) );
			}
		},
		private_getRepeater : function ( event, socket ){
			var emit = this.emit;
			return function( data ){ var m = {}; m[event] = {socket:socket, data:data}; emit( m )}
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