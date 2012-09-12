/*!
 *
 * Sockets.js
 * com.neuromantic.arete.server.Sockets
 *
 */
_package( 'com.neuromantic.arete.server',
 	_import( 'com.neuromantic.arete.component.Component' ),
	_class( 'Sockets' )._extends( 'Component', {
		private_io: null,
	
		Sockets: function( config ) {
			if( typeof require === 'function' ){
				this._.io = require('socket.io');
				this._.io.sockets.on('connection', this._.onConnect );
				this._.io.listen(config.http)
			}
		},
		private_accept : function( eventName ) {
			if( this._events.indexOf( eventName ) + 1 ){
				this._.events.push( eventName );
			}
		},
		private_onConnect : function ( socket ){
			for(var n = 0; n < this._.events.length; n ++ ){
				var event = this._.events[n];
				socket.on( event, this._.getRepeater( event, socket ) );
			}
		},
		private_getRepeater : function ( event, socket ){
			var emit = this.emit;
			return function( data ){ var m = {}; m[event] = {socket:socket, data:data}; emit( m ); }
		},
		private_listen : function ( location ){
			if(location.host && location.port ){
				this._.http.listen(  location.port, location.host )
				console.log( 'server listening at', location.host, 'on port', location.port )
			}
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