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
    _import( 'com.grabnetworks.advertisement.VideoAd' ),
    _import( 'com.grabnetworks.advertisement.AdEvent' ),
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
        private_videoAd: null,
        private_currentVideo: null,
        private_settings: {
            width: 640,
            height: 360
        },
        private_content: null,
        private_deferredCalls: [],
        private_ready: false,
        private_div : null,
        private_likeDiv: null,
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
                        if( fn.name ){
                            fn = this._.swf[ fn.name ];
                        }
                        fn.apply(this, fn.args);
                        this._.deferredCall = null;
                    }
                }
        },
        start : function () {
            if(this._.playlist){
                this.renderContent( this._.playlist.videos[0], { autoPlay : this._.settings.autoPlay || this._.options.grabnetworks.player.behavior.autoPlay } );
            }
        },
        private_buildHTML : function () {
            this.type = 'h5';
    		if( !this._.video ){
                this._.video = new Video( {
                    id : this._.playerID,
                    style : {
                        background : 'black' 
                    }
                } );
			}
            if( this._.options.grabnetworks.advertisement.enabled && !this._.videoAd){
                this._.videoAd = new VideoAd( this._.video );
            }
            if(this._.div){
                this.replace( this._.video, this._.div );
            }
            this._.notify( new PlayerEvent( PlayerEvent.PLAYER_READY ) );
        },
        private_onSWFObject : function( swf ){
            if(swf.ref){
                this._.swf = swf.ref;
                this.type = 'v5';
                if(this._.settings.likeButton){
                   this._.likeDiv = new Div( { id: 'grabLike' } );
                   this._.likeDiv.width( this.width() );
                   this._.likeDiv.height( 70 );
                   this.append( this._.likeDiv );
                }
            }else{
                this._.buildHTML(); 
            }
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
			var eventhandler = 'eventRouter';
            flashvars.id = this.id;
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
            if(! this._.div ) {
    			this._.div = Element.byID( divID );
                if( this._.div ){
                    this._.div.parent().replace( this, this._.div );
                }else{
                    this._.div = new Div( { id : divID } );
                    this._.div.style({ backgroundColor : '#000000' });
                    this.width( this._.settings.width );
                    this.height( this._.settings.height );
                }
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
            if( this._.likeDiv ){
                this._.likeDiv.y( this._.settings.height );
                this._.height = this._.likeDiv.y() + this._.likeDiv.height();
            }
            this._super()._.layout();
            if(this._.previewImage){
                this._.previewImage.x( 0 );
                this._.previewImage.y( 0 );
                this._.previewImage.height( this._.settings.height );
                this._.previewImage.width( this._.settings.width );
            }
            if( this._.playButton ){
                this._.playButton.x( ( this._.settings.width - this._.playButton.width() ) * 0.5 );
                this._.playButton.y( ( this._.settings.height - this._.playButton.height() ) * 0.5 );
            }
            if(this._.video){
                this._.video.width( this._.settings.width );
                this._.video.height( this._.settings.height );
            }
        },
        private_onVideoMouseOver : function ( event ){
            if( this._.video ){
                this._.video.tag({ controls : 'controls' });//until a ui layer exists
            }
        },
        private_onVideoMouseOut : function ( event ){
            if( this._.video ){
                this._.video.tag({ controls : null });//until a ui layer exists
            }
        },
        private_onPlayButtonClick : function ( event ){
            this._.startVideo();
        },
        private_onImageLoaded : function ( event ){
            this._.layout();
        },
        private_onAdStopped : function ( event ){
            this._.playVideo();
        },
        private_addEvents : function (){
            if( this._.video){
                this._.video.on( MouseEvent.OVER, this._.onVideoMouseOver);
                this._.video.on( MouseEvent.OUT, this._.onVideoMouseOut);    
            }
            this._.playButton.on( MouseEvent.CLICK, this._.onPlayButtonClick );
            this._.previewImage.on( MouseEvent.CLICK, this._.onPlayButtonClick );
            this._.playButton.on( LoadingEvent.COMPLETE, this._.onImageLoaded );
            this._.previewImage.on( LoadingEvent.COMPLETE, this._.onImageLoaded );
            if( this._.videoAd ){
                this._.videoAd.on( AdEvent.STOPPED, this._.onAdStopped );
                this._.videoAd.on( AdEvent.ERROR, this._.onAdStopped );
            }
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
        private_renderPreview : function() {
            var media = this._.content.video.media;
            if( this._.swf){
                this._.swf.renderContent ( this._.content );
            }else{
                this._.previewImage.load( media.preview.url || media.thumbnail.url );
                this._.previewImage.visible( true );
                this._.playButton.visible( true );
            }
        },
        private_renderVideo : function( content, secret ){
            if( this._.video ) {
                this._.video.load( this._.content.video.media.mobile.url );
            }
        },
        private_startVideo : function(){
            this._.previewImage.visible( false );
            this._.playButton.visible( false );
            if(this._.video){
                this._.renderVideo();
            }
            if(this._.videoAd){
                this._.videoAd.play( this._.content );
            } else {
                this.playVideo();
            }
        },
        Player : function ( settings ){
            //Code._.debugging = DebugLevels.ERROR;
            if ( settings.variant === '' ) {
				delete settings.variant;
			}//if
            this._super( settings );
		},
        eventRouter: function(eventObject) {
            if ( eventObject.event == PlayerEvent.PLAYER_READY ) {
                this._.callDeferred();
            }
            this._.notify( new PlayerEvent( eventObject.event, eventObject.value ) );
        },
        hide : function () {
            this.destroy();
            this._super().hide();
        },
        show: function () {
            this._super().show();
            if( ! this._.swf && ! this._.video ){
                this._.render();
            }
        },
        destroy: function() {
            if (this._.swf) {
                this.replace( this._.div, new Element(this._.swf) );
                this._.swf = null;
            }
            if (this._.video) {
                this.replace( this._.div, this._.video );
                this._.video = null;
            }
            if (this._.videoAd) {
                this.remove( this._.videoAd );
                this._.videoAd = null;
            }
            if (this._.previewImage){
                this.remove( this._.previewImage );
                this._.previewImage = null;
            }
            if (this._.playButton){
                this.remove( this._.playButton );
                this._.playButton = null;
            }
            
        },
        id : 'uninitialized',
        type : 'uninitialized',
        renderContent: function( content, secret ) {
            this._.content = content;
            this._.defer( this._.renderPreview, arguments );
            if (secret && secret.autoPlay) {
                this._.defer( this._.startVideo, arguments );
            }
        },
        loadNewVideo: function( guid, secret ) {
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