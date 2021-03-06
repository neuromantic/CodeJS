/*!
 *
 * InlinePlayer.js
 * com.grabnetworks.vcl.components.widgets.InlinePlayer
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',

 	_import( 'com.neuromantic.arete.component.widget.Widget' ),
 	_import( 'com.grabnetworks.player.Player' ),
 	_import( 'com.grabnetworks.player.PlayerEvent' ),
 	
	_class( 'InlinePlayer' )._extends( 'Widget', {
		InlinePlayer : function ( settings ) {
			this._super( settings );
		},
		private_player: null,
		private_onEnded : function ( guid ) {
			this.emit( {ended: guid} );
		},
		private_onStarted : function ( guid ) {
			this.emit( { started: guid } );
		},
		config : function ( config ){
			this._super().config( config );
		},
		render: function ( config ){
			if(config.id){
				var playerSettings = { id: config.id, parent: this.element.tag(), width: config.width || '100%', height: config.width * 0.5625 || '100%', content : false };
				this._.player = new Player( playerSettings );
				this._.player.on( PlayerEvent.VIDEO_ENDED, this._.onEnded );
				this._.player.on( PlayerEvent.VIDEO_STARTED, this._.onStarted );
			}
		},
		process : function ( message ) {
			if(message.video ){
				return this._.player.loadNewVideo( message.video.guid )
			}
			if( message.videos ){
				return this._.player.loadNewVideo( message.videos[ 0 ].video.guid );
			}
			this._super().process( message );
		}
	} )
);