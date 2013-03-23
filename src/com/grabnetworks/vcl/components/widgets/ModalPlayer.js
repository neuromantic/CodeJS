/*!
 *
 * ModalPlayer.js
 * com.grabnetworks.vcl.components.widgets.ModalPlayer
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',

     _import( 'com.neuromantic.arete.component.widget.Widget' ),
 	_import( 'com.grabnetworks.player.Modal' ),
 	_import( 'com.grabnetworks.player.PlayerEvent' ),
 	
	_class( 'ModalPlayer' )._extends( 'Widget', {
		ModalPlayer : function ( settings ) {
			this._super( settings );
		},
		private_modal: null,
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
				var playerSettings = { id: config.id, parent: this.element, width: 800, height: 450, content : false };
				this._.modal = new Modal( playerSettings );
				this._.modal.player.on( PlayerEvent.VIDEO_ENDED, this._.onEnded );
				this._.modal.player.on( PlayerEvent.VIDEO_STARTED, this._.onStarted );
			}
		},
		process : function ( message ) {
			if(message.video){
				return this._.modal.play( message.video.guid );
			}
			this._super().process( message );
		}
	} )
);