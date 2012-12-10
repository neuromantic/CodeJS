/*!
 *
 * Player.js
 * com.grabnetworks.player.Player
 *
 */
_package( 'com.grabnetworks.player',
	_import('swfobject'),
	_import( 'com.grabnetworks.player.PlayerEvent' ),
	_class( 'Player', {
		static_local: false,
        private_swf: null,
        private_settings: {
            id: 1720202,
            width: 400,
            height: 300
          },
          private_deferredCall: null,
          private_eventListeners: {},
          private_defer: function( functionName, argument) {
          	var _this = this;
          	if( this._.swf){
	            var deferredCall = function (){ _this._.swf[functionName](argument) };
	            try {
	              deferredCall();
	            } catch (e) {
	              this._.deferredCall = deferredCall;
	            }
            }else{
            	this._.deferredCall = { functionName: functionName, argument: argument };
            }
          },
          private_div : null,
          private_eventRouter: function(eventObject) {
            switch (eventObject.event) {
            case PlayerEvent.PLAYER_READY:
              if (this._.deferredCall) {
                this._.deferredCall();
                this._.deferredCall = null;
              }
              break;
            }
            var listeners = this._.eventListeners[eventObject.event];
            if (listeners && listeners.length) {
              for (var n = 0; n < listeners.length; n++) {
                listeners[n](eventObject.value);
              }
            }
          },
          private_playerID : '',
          private_setSWF : function ( swf ){
//        	  var objects = this._.parent.getElementsByTagName( 'object' );
//	    	  for (var i= 0; i < objects.length; i++ ){
//	    		 var swfElement = objects[i]
//	    		 if( swfElement.id == this._.playerID ){
//	    			 break;
//	    		 }
//	    	  }
			this._.swf = swf.ref;//swfElement;
			this._.swf.style.visibility = 'block';
			this._.swf.style.display = 'visible' ;
			this.style = this._.swf.style;
			if (this.onReady) {
				this.onReady();
			}//if
			if(this._.deferredCall){
				var functionName = this._.deferredCall.functionName;
				var argument = this._.deferredCall.argument
				this._.deferredCall = null;
				this[ functionName ]( argument);
			}
          },
          Player : function ( settings ){
			if (settings.variant == '') {
				delete settings.variant;
			}//if
			var settings = this._.settings = settings || this._.settings;
			var params = { allowScriptAccess: 'always', allowFullScreen: 'true', wmode: 'transparent', menu: 'false', bgcolor: '#000000', quality: 'high' };//params
			var env = settings.env;
			env = env || '';
			delete settings.env;
			var width = settings.width;
			delete settings.width;
			var height = settings.height;
			delete settings.height;
			var flashvars = settings;
			var id = settings.id;
			var namespace = 'Player._.players[' + id + ']';
			var eventhandler = '_.eventRouter';
			flashvars.namespace = namespace;
			flashvars.eventhandler = eventhandler;
			this._.playerID = 'GrabPlayer' + settings.id;
		    var divID = 'grabDiv' + id
			this._.parent = settings.parent
			var div = document.getElementById(divID);
		      if( !div ){
		      	div = document.createElement( 'div');
		      	div.id = divID;
		      	settings.parent.appendChild( div );
		      }
			div.style.display = 'none';
			div.style.visibility = 'hidden';
			var attributes = { id: this._.playerID, name: this._.playerID };//attributes
			var baseURL = Player.local ? '' : 'http://player.grabnetworks.com/v5' + env + '/';
			swfobject.embedSWF(baseURL + 'Player.swf', div.id, width, height, '9.0.0', false, flashvars, params, attributes, this._.setSWF);
			Player._ = Player._ || { players:[] };
			Player._.players[id] = this;
		},//Player
        on: function(eventName, doThis) {
          this._.eventListeners[eventName] = this._.eventListeners[eventName] || [];
          this._.eventListeners[eventName].push( doThis );
        },
        off: function(eventName) {
          if (eventName) {
            if (this._.eventListeners[eventName]) {
              delete this._.eventListeners[eventName]
            }
          } else {
            this._eventListeners = {};
          }
        },
        loadNewVideo: function( guid ) {
          this._.defer( 'loadNewVideo', guid );
        },
        toggleDebug: function() {
          this._.defer(  'toggleDebug' );
        },
        stopVideo: function() {
          this._.defer( 'stopVideo' );
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
          this._.defer( 'pauseVideo' );
        },
        playVideo: function() {
          this._.defer( 'playVideo' );
        },
        replayVideo: function() {
          this._.defer( 'replayVideo' );
        },
        seekVideoTo: function( percent ) {
          this._.defer( 'seekVideoTo', percent );
        },
        seekVideoToMS: function(milliseconds) {
          this._.defer( 'seekVideoToMS', milliseconds );
        },
        setVolume: function(level) {
          this._.defer( 'setVolume', level);
        },
        mute: function() {
          this._.defer( 'mute' );
        },
        skipAd: function() {
          this._.defer( 'skipAd' );
        },
        videoTotalTime: function() {
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