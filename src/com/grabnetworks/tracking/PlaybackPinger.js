/*!
 *
 * PlaybackPinger.js
 * com.grabnetworks.tracking.PlaybackPinger
 *
 */
_package( 'com.grabnetworks.tracking',
    _import( 'com.grabnetworks.tracking.Ping' ),
    _class( 'PlaybackPinger', {
        private_productID : '',
        private_player : null,
        private_ping : function ( params ){
            var ping = new Ping();
            ping.params( { p: this._.productID, i: this._.player.id, t: this._.player.type } );
            ping.send( params );
        },
        private_onPlayerVideoStarted : function ( event ){
           this._.ping( { e: 'view' } );
        },
        private_onPlayerVideoPlayed : function ( event ){
            this._.ping( { e: 'play' } );
        },
        private_onPlayerPlayerSWFReady : function ( event ){
           //this._.ping( { e: 'ready' } );
        },
        private_onPlayerVideoKeyFrame : function ( event ){
            //quartile beacons
        },
        private_onPlayerPreRollStarted : function ( event ){
           this._.ping( { e: 'preroll' } );
        },
        PlaybackPinger : function ( player, productID){
            this._.player = player;
            this._.productID = productID;
            player.on( PlayerEvent.VIDEO_STARTED, this._.onPlayerVideoStarted)
            player.on( PlayerEvent.PLAYER_READY, this._.onPlayerPlayerSWFReady);
            player.on( PlayerEvent.VIDEO_KEYFRAME, this._.onPlayerVideoKeyFrame);
            //player.on( PlayerEvent.CONTENT_ERROR, this._.onPlayerContentError);
            //player.on( PlayerEvent.VIDEO_ENDED, this._.onPlayerVideoEnded);
            //player.on( PlayerEvent.VIDEO_PAUSED, this._.onPlayerVideoPaused);
            player.on( PlayerEvent.VIDEO_PLAYING, this._.onPlayerVideoPlayed);
    		// player.on( PlayerEvent.PREROLL_ENDED, this._.onPlayerPreRollEnded);
    		player.on( PlayerEvent.PREROLL_STARTED, this._.onPlayerPreRollStarted);
    		// player.on( PlayerEvent.PREROLL_CLICKED, this._.onPlayerPreRollSelected);
        }
    })
);