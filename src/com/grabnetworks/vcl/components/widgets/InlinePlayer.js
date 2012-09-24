/*!
 *
 * InlinePlayer.js
 * com.grabnetworks.vcl.components.widgets.InlinePlayer
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',

 	_import( 'com.neuromantic.arete.component.Widget' ),
 	_import( 'com.grabnetworks.player.Player' ),
 	_import( 'com.grabnetworks.player.PlayerEvent' ),
 	
	_class( 'InlinePlayer' )._extends( 'Widget', {
		private_player: null,
		private_onEnded : function ( guid ) {
			this.emit( {ended: guid} );
		},
		private_onStarted : function ( guid ) {
			this.emit( { started: guid } );
		},
		config : function ( config ){
			this._super().config( config );
			if(config.id){
				var settings = {id: config.id, parent: this.element, width: '100%', height: '100%', content : false };
				this._.player = new Player( settings );
				this._.player.on( PlayerEvent.VIDEO_ENDED, this._.onEnded );
				this._.player.on( PlayerEvent.VIDEO_STARTED, this._.onStarted );
			}
		},
		process : function ( message ) {
			if(message.video){
_debug( 'attempting to play', message.video.title );
				return this._.player.loadNewVideo( message.video.guid)
			}
			this._super().process( message );
		}
	} )
);