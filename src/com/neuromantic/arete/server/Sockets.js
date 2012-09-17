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
		private_listen : function( server ){
			this._.io = require('socket.io').listen( server );
			this._.io.sockets.on('connection', this._.onConnect );
		},
		process : function ( message ){
			if( message.server && message.server.http ){
				this._.listen( message.server.http );
			}
			this._super().process( message );
		}//, 
	})
);