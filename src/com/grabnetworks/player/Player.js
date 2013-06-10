/*!
 *
 * Player.js
 * com.grabnetworks.player.Player
 *
 */
_package( 'com.grabnetworks.player',
    _import('com.deconcept.swfobject'),
    _import( 'com.grabnetworks.player.PlayerEvent' ),
    _import( 'com.grabnetworks.vidify.Badger' ),
    _import( 'com.grabnetworks.loading.ContentLoader' ),
    _import( 'com.grabnetworks.proto.GrabApp' ),
    
    _import( 'com.neuromantic.arete.dom.elements.Div'),
    _import( 'com.neuromantic.arete.dom.elements.media.Video'),
    _import( 'com.neuromantic.arete.dom.elements.media.Img'),
    _import( 'com.neuromantic.arete.environment.Browser'),
    _import( 'com.neuromantic.arete.utils.URIUtil'),
    _import( 'com.neuromantic.arete.net.JSONP'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _import( 'com.neuromantic.arete.events.Notifier'),
    _class( 'Player' )._extends( 'GrabApp', {
		static_local: false,
        static_players : [],
        private_swf: null,
        private_video: null,
        private_currentVideo: null,
        private_settings: {
            width: 640,
            height: 360
        },
        private_deferredCalls: [],
        private_ready: false,
        private_div : null,
        private_parent : null,
        private_environment : 'grabqa', // 'grabnetworks',
        private_defer: function( fn, args ) {
            var deferredCall;
            if( typeof fn === 'function' ){
                deferredCall = function () { fn.apply( null, args) };
            }else{
                if( this._.swf){
                    var _this = this;
                    deferredCall = function (){ _this._.swf[fn].apply( null, args ); };
                }else{
                    deferredCall = { name: fn, args: args };
                }
            }
            try {
                deferredCall();
            } catch (e) {
                this._.deferredCalls.push( deferredCall );
            }
        },
        private_callDeferred : function (){
            for( var i = 0; i < this._.deferredCalls.length; i++){
                    var fn = this._.deferredCalls[i];
                    if (fn) {
                        var args = fn.args;
                        if( name ){
                            fn = this._.swf[ fn.name ];
                        }
                        fn.apply(this, args);
                        this._.deferredCall = null;
                    }
                }
        },
        private_eventRouter: function(eventObject) {
            if ( eventObject.event == PlayerEvent.PLAYER_READY ) {
                this._.callDeferred();
            }
            this._.notify( new PlayerEvent( eventObject.event, eventObject.value ) );
        },
        private_buildHTML : function (){
            this.type = 'h5';
    		if( !this._.video ){
                this._.video = new Video( {
                    height : this._.settings.height,
                    width : this._.settings.width,
                    id : this._.playerID,
                    style : {
                        background : 'black' 
                    }
                } );
			}
            if(this._.div){
                this.replace( this._.video, this._.div );
                this._.div = null;
            }
            this._.notify( new PlayerEvent( PlayerEvent.PLAYER_READY ) );
        },
        private_onSWFObject : function ( swf ){
            if(swf.ref){
                this._.swf = swf.ref;
                this.type = 'v5';
            }else{
                this._.buildHTML(); 
            }
            this.renderContent( this._.playlist.videos[0], { autoPlay : this._.settings.autoPlay || this._.options.grabnetworks.player.behavior.autoPlay } );
            if (typeof this._.onReady === 'function') {
                this._.onReady();
    			this._.onReady = null;
            }
        },
        private_trySWF : function () {
            var settings = this._.settings;
            var params = { allowScriptAccess: 'always', allowFullScreen: 'true', wmode: 'transparent', menu: 'false', bgcolor: '#000000', quality: 'high' };//params
			var env = settings.env || '';
			delete settings.env;
			var width = settings.width || 640;
			var height = settings.height || 360;
			var flashvars = settings;
			var namespace = 'com.grabnetworks.player.Player.players[' + this.id + ']';
			var eventhandler = '_.eventRouter';
			flashvars.namespace = namespace;
			flashvars.eventhandler = eventhandler;
            flashvars.content = false;
            this._.options.grabnetworks.content = false;
            var optionsString = JSON.stringify( this._.options );
            flashvars.config = encodeURIComponent(optionsString);
            var attributes = { id: this._.playerID, name: this._.playerID };
           // if ( !settings.local && scriptInfo.host.indexOf('grabqa') > -1 ){
           //     settings.tgt = settings.tgt || 'grabqa';
           //     this._.environment = 'grabqa';
           // }
            var swfDir = ( settings.local ) ?  settings.local + '/'  : 'http://player.' + this._.environment + '.com/v5' + env + '/';
            swfobject.embedSWF( swfDir + 'Player.swf', this._.div.id(), width, height, '9.0.0', false, flashvars, params, attributes, this._.onSWFObject);
        }, 
        private_build : function () {
            this._.playerID = 'GrabPlayer' + this.id;
            var divID = 'grabDiv' + this.id;
			this._.div = Element.byID( divID );
            if( this._.div ){
                this._.div.parent().replace( this, this._.div );
            }else{
                this._.div = new Div( { id : divID } );
            }
            this.append( this._.div );
            this._.previewImage = new Img(); 
            this.append( this._.previewImage );
            this._.playButton = new Img({ src:'http://static.grab-media.com/images/badges/playL.png' });
            this.append( this._.playButton );
            this._.trySWF();
        },
        private_setup: function (){
        	Player.players[ this.id ] = this;  
        },
        /************************* events **************************/
        private_layout : function () {
            this._super()._.layout();
            this._.previewImage.x( 0 );
            this._.previewImage.y( 0 );
            this._.previewImage.height( this.height() );
            this._.previewImage.width( this.width() );
            this._.playButton.x( ( this.width() - this._.playButton.width() ) * 0.5 );
            this._.playButton.y( ( this.height() - this._.playButton.height() ) * 0.5 );
        },
        private_onMouseOver : function ( event ){
            if( this._.video ){
                this._.video.tag({ controls : 'controls' });
            }
        },
        private_onMouseOut : function ( event ){
            if( this._.video ){
                this._.video.tag({ controls : null });//until a ui layer exists
            }
        },
        private_onPlayButtonClick : function ( event ){
            this.playVideo();
        },
        private_onImageLoaded : function ( event ){
            this._.layout();
        },
        private_addEvents : function (){
            this.on( MouseEvent.OVER, this._.onMouseOver);
            this.on( MouseEvent.OUT, this._.onMouseOut);    
            this._.playButton.on( MouseEvent.CLICK, this._.onPlayButtonClick );
            this._.playButton.on( LoadingEvent.COMPLETE, this._.onImageLoaded );
            this._.previewImage.on( LoadingEvent.COMPLETE, this._.onImageLoaded );
        },
        /***********************************************************/
        private_load : function ( guid ) {
            if(this._.video){
                this._.loadPlaylist( guid );
            }else{
                this._.swf.loadNewVideo( guid );
            }
        },
        private_play : function () {
            this._.previewImage.visible( false );
            this._.playButton.visible( false );
            if(this._.video){
                this._.video.play();
            }else{
                this._.swf.playVideo();
             }
        },
        private_pause : function () {
            if(this._.video){
                this._.video.pause();
            }else{
                this._.swf.pauseVideo();
            }
        },
        private_stop : function () {
            this._.previewImage.visible( true );
            this._.playButton.visible( true );
            if(this._.video){
                this._.video.stop();
            } else {
                this._.swf.stopVideo();
            }
        }, 
        private_seek : function ( ms ){
            if(this._.video){
                this._.video.seek( ms );
            }else{
                this._.swf.seekVideoToMS( ms );
            }
        },
        private_seekPercent : function ( pct ){
            if(this._.video){
                this._.seek( ( pct * 0.01 ) * ( this._.video.duration ) );
            }else{
                this._.swf.seekVideoTo( pct );
            }
        },
        private_setVolume : function ( level ){
            if(this._.video){
                this._.video.volume = level * 0.01;
            }else{
                this._.swf.setVolume(level);
            }
        },
        private_renderVideo : function( content, secret ){
            if(this._.video){
                this._.video.load( content.video.media.mobile.url );
            }else{
                this._.swf.renderContent( content );
            }
            if (secret && secret.autoPlay){
                this.playVideo();
            }else{
                this.stopVideo();
            }
        },
        Player : function ( settings ){
            if ( settings.variant === '' ) {
				delete settings.variant;
			}//if
            this._super( settings );
		},
        id : 'uninitialized',
        type : 'uninitialized',
        renderContent: function( content, secret ) {
            var media = content.video.media;
            this._.previewImage.load( media.preview.url || media.thumbnail.url );
            this._.defer( this._.renderVideo, arguments );
        },
        loadNewVideo: function( guid ) {
            this._.defer( this._.load, arguments);
        },
        toggleDebug: function() {
            this._.defer( 'toggleDebug' );
        },
        stopVideo: function() {
            this._.defer( this._.stop );
        },
        showEmbed: function() {
          this._.defer( 'showEmbed' );
        },
        hideEmbed: function() {
          this._.defer( 'hideEmbed' );
        },
        hideInfo: function() {
          this._.defer( 'hideInfo' );
        },
        showInfo: function() {
          this._.defer( 'showInfo' );
        },
        showSharing: function() {
          this._.defer( 'showSharing' );
        },
        hideSharing: function() {
          this._.defer( 'hideSharing' );
        },
        showEmail: function() {
          this._.defer( 'showEmail' );
        },
        hideEmail: function() {
          this._defer( 'hideEmail' );
        },
        pauseVideo: function() {
            this._.defer( this._.pause );
        },
        playVideo: function() {
            this._.defer( this._.play );
        },
        replayVideo: function() {
          this._.defer( 'replayVideo' );
        },
        seekVideoTo: function( percent ) {
          this._.defer( this._.seekPercent, arguments);
        },
        seekVideoToMS: function( milliseconds ) {
          this._.defer( this._.seek, arguments );
        },
        setVolume: function(level) {
          this._.defer( this._.setVolume, arguments );
        },
        mute: function() {
          this._.defer( 'mute' );
        },
        skipAd: function() {
          this._.defer( 'skipAd' );
        },
        videoTotalTime: function() {
            if( this._.video){
                return this._.video.duration();
            }
            return this._.swf.videoTotalTime();
        },
        videoCurrentTime: function() {
          return this._.swf.videoCurrentTime();
        },
        videoTitleText: function() {
          return this._.swf.videoTitleText();
        },
        videoDescriptionText: function() {
          return this._.swf.videoDescriptionText();
        },
        videoSourceLogo: function() {
          return this._.swf.videoSourceLogo();
        },
        videoSourceURL: function() {
          return this._.swf.videoSourceURL();
        },
        videoInfo: function() {
          return this._.swf.videoInfo();
        }
	})
);