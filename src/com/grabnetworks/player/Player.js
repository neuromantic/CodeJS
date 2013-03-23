/*!
 *
 * Player.js
 * com.grabnetworks.player.Player
 *
 */
_package( 'com.grabnetworks.player',
    _import('swfobject'),
    _import( 'com.grabnetworks.player.PlayerEvent' ),
    _import( 'com.neuromantic.arete.dom.Div'),
    _import( 'com.neuromantic.arete.dom.media.Video'),
    _import( 'com.neuromantic.arete.utils.BrowserUtil'),
    _import( 'com.neuromantic.arete.utils.URIUtil'),
    _import( 'com.neuromantic.arete.net.JSONP'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _import( 'com.neuromantic.arete.events.Notifier'),
	_class( 'Player' )._extends( 'Notifier', {
		static_local: false,
        static_players : [],
        private_swf: null,
        private_video: null,
        private_settings: {
            id: 1720202,
            width: 400,
            height: 300
        },
        private_deferredCalls: [],
        private_ready: false,
        private_div : null,
        private_parent : null,
        private_options : null,
        private_environment : 'grabnetworks',
        private_optionsLoader : null,
        private_contentLoader : null,
        private_contentServer: 'http://content.grabnetworks.com/',
        private_defer: function( fn, argument) {
            var deferredCall;
            if( typeof fn === 'function' ){
                deferredCall = function () { fn( argument ) };
            }else{
                if( this._.swf){
                    var _this = this;
                    deferredCall = function (){ _this._.swf[fn](argument) };
                }else{
                    deferredCall = { name: fn, argument: argument };
                }
            }
            try {
                deferredCall();
            } catch (e) {
                this._.deferredCall.push( deferredCall );
            }
        },
        private_eventRouter: function(eventObject) {
            if ( eventObject.event == PlayerEvent.PLAYER_READY ) {
                for( var i = 0; i < this._.deferredCalls.length; i++){
                    var fn = this._.deferredCall;
                    if (fn) {
                        var name = fn.name;
                        var arg = fn.argument;
                        if( name ){
                            fn = this._.swf[ name ];
                        }
                        typeof arg === 'undefined' ? fn() : fn( arg );
                        this._.deferredCall = null;
                    }
                }
            }
            this._.notify( new PlayerEvent( eventObject.event, eventObject.data ) );
          },
          private_playerID : '',
          private_onSWFObject : function ( swf ){
            if(swf.ref){
                this._.swf = swf.ref;
                this._.swf.style.display =  'block';
                this._.swf.style.visibility = 'visible';
                this.style = this._.swf.style;
            }else if( this._.div ){
                this._.contentServer = 'http://content.' + this._.environment + '.com';
                this._.loadOptions( this._.settings.id );
            }else{
                throw new Error( 'Error initializing playback engine. SWFObject did not create Flash Player, and there is no target div for a video tag.');
            }
        },
        private_loadOptions : function( id ){
            this._.optionsLoader = new JSONP( 'jsonp' );
            this._.optionsLoader.on( LoadingEvent.LOADED, this._.onOptionsLoaded);
            this._.optionsLoader.load(this._.contentServer + '/' + 'options/' + id + '.json');
        },
        private_onOptionsLoaded : function( event ){
            var options = event.data;
			this._.options = options.grabnetworks;
			var guid = this._.settings.content || this._.options.content;
            this._.loadContent( guid );
        },
        private_loadContent : function( contentID ){
		    var type;
			var guid;
			switch ( contentID.length ) {
				case 40:
					guid = contentID;
					type = 'v';
					break;
				case 41:
					guid = contentID.substr( 1 );
					type = contentID.substr( 0, 1 );
					break;
				default:
					throw new Error( 'Invalid GUID length' );
			}
            var fromPage = escape(global.location.href.toString());
            this._.contentLoader = new JSONP( 'jsonp' );
            this._.contentLoader.on( LoadingEvent.LOADED, this._.onContentLoaded );
            this._.contentLoader.load(  this._.contentServer + '/' +  type + '/' + guid + '?from=' + fromPage );
        },
        private_onContentLoaded: function ( event ){
            var content = event.data;
            content = ( content.videos ? content.videos[ 0 ] : content );// no playlists in HTML5 yet, grab first video.
            if( content.video.media.mobile ){
				if(!this._.video){
                    this._.video = new Video( {
                        height : this._.settings.height,
                        width : this._.settings.width,
                        controls : 'controls',
                        preload : 'auto',
                        id : this._.playerID,
                        style : {
                            visibility : 'block',
                            display : 'visible'
                        }
                    });
				}
                this.style = this._.video.style();
                this._.video.tag({autoplay :  ( this._.settings.autoPlay || this._.options.player.behavior.autoPlay ) ? 'autoplay': null});
                this._.video.load(content.video.media.mobile.url);
                if(this._.div){
                    this._.parent.replace( this._.video, this._.div );
                    this._.div = null;
                }
            }else{
                this._.div.style({
                    display : 'block',
                    textAlign : 'center',
                    verticalAlign : 'middle',
                    backgroundColor : '#a12a3d',
                    color : '#FFFFFF',
                    width : this._.settings.width + 'px',
                    height :  this._.settings.height + 'px',
                    fontSize : 150 + 'px'
                });
                this._.div.text( 'mobile?<br/>NOPE.' );
            }
            if (typeof this._.onReady === 'function') {
                this._.onReady();
				this._.onReady = null;
            }
        },
        private_load : function ( guid ) {
            if(this._.video){
                this._.loadContent( guid );
            }else{
                this._.swf.loadNewVideo( guid );
            }
        },
        private_play : function () {
            if(this._.video){
                this._.video.play();
            }else{
                this._swf.playVideo();
            }
        },
        private_pause : function () {
            if(this._.video){
                this._.video.pause();
            }else{
                this._swf.pauseVideo();
            }
        },
        private_stop : function () {
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
        Player : function ( settings ){
            if (settings.variant === '') {
				delete settings.variant;
			}//if
			settings = this._.settings = settings || this._.settings;
			var params = { allowScriptAccess: 'always', allowFullScreen: 'true', wmode: 'transparent', menu: 'false', bgcolor: '#000000', quality: 'high' };//params
			var env = settings.env || '';
			delete settings.env;
			var width = settings.width;
			var height = settings.height;
			var flashvars = settings;
			var id = settings.id;
			var namespace = 'Player.players[' + id + ']';
			var eventhandler = '_.eventRouter';
			flashvars.namespace = namespace;
			flashvars.eventhandler = eventhandler;
			this._.playerID = 'GrabPlayer' + settings.id;
            this._.divID = 'grabDiv' + id;
			this._.parent = new Element(settings.parent);
			var div = Element.byID( this._.divID );
            if( !div ){
                div = new Div({
                    id : this._.divID
                });
                this._.parent.append( div );
            }else{
                this._.parent = div.parent();   
            }
            this._.div = div;
            var attributes = { id: this._.playerID, name: this._.playerID };
//            if ( !settings.local && scriptInfo.host.indexOf('grabqa') > -1 ){
//                settings.tgt = settings.tgt || 'grabqa';
//                this._.environment = 'grabqa';
//            }
            var swfDir = ( settings.local ) ?  settings.local + '/'  : 'http://player.' + this._.environment + '.com/v5' + env + '/';
            swfobject.embedSWF( swfDir + 'Player.swf', this._.divID, width, height, '9.0.0', false, flashvars, params, attributes, this._.onSWFObject);
			Player.players[id] = this;
		},
        style : {},
        hide : function () {
            this.style.display = 'none';
            this.style.visibility = 'hidden';
        },
        show : function () {
            this.style.visibility = 'visible';
            this.style.display = 'block';
        },
        loadNewVideo: function( guid ) {
            this._.defer( this._.load, guid );
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
          this._.defer( this._.seekPercent, percent );
        },
        seekVideoToMS: function( milliseconds ) {
          this._.defer( this._.seek, milliseconds );
        },
        setVolume: function(level) {
          this._.defer( this._.setVolume, level );
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