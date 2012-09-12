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
_debug( '+'+this, JSON.stringify(config) );
			if( typeof require === 'function' ){
				this._.io = require('socket.io').listen( 8080 );
				this._.io.sockets.on('connection', this._.onConnect );
				
			}
		},
		private_accept : function( eventName ) {
			if( this._events.indexOf( eventName ) + 1 ){
				this._.events.push( eventName );
			}
		},
		private_onConnect : function ( socket ){
			_debug(this, '._.onConnect', socket)
			for(var n = 0; n < this._.events.length; n ++ ){
				var event = this._.events[n];
				socket.on( event, this._.getRepeater( event, socket ) );
			}
		},
		private_getRepeater : function ( event, socket ){
			var emit = this.emit;
			return function( data ){ var m = {}; m[event] = {socket:socket, data:data}; emit( m ); }
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