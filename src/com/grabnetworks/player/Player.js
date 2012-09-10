/*!
 *
 * PlayerEvent.js
 * com.grabnetworks.player.PlayerEvent
 *
 */
_package( 'com.grabnetworks.player',
	_import('swfobject'),
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
          private_defer: function(asThis, doThis, withThis) {
            var deferredCall = enclose(asThis, doThis, withThis)
            try {
              deferredCall();
            } catch (e) {
              this.deferredCall = deferredCall;
            }
          },
          private_eventRouter: function(eventObject) {
            switch (eventObject.event) {
            case PlayerEvent.PLAYER_READY:
              if (this.deferredCall) {
                this.deferredCall();
                this.deferredCall = null;
              }
              break;
            }
            var listeners = this.eventListeners[eventObject.event];
            if (listeners && listeners.length) {
              for (var n = 0; n < listeners.length; n++) {
                listeners[n](eventObject.value);
              }
            }
          },
          private_playerID : '',
          private_setSWF : function ( swf ){
        	  var swfElement = document.getElementById(this._.playerID);
				this._.swf = swfElement;
				this._.swf.style.visibility = 'block';
				this._.swf.style.display = 'visible' ;
				this.style = this._.swf.style;
				if (this.onReady) {
					this.onReady();
				}//if
          },
          
        Player : function ( settings ){
_debug('+Player',JSON.stringify( settings) );
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
			var scripts = document.getElementsByTagName('script');
_debug('scripts =', scripts);
			var script = scripts[scripts.length -1];
_debug('script =', script);
			var parent = script.parentNode;
_debug('parent =', parent);
			var divID = 'grabDiv'+settings.id
_debug('divID =', divID);
			var div = document.createElement( 'div');
_debug('div =', div);
			div.id = divID;
			parent.appendChild(div);
			div.style.display = 'none';
			div.style.visibility = 'hidden';
			var attributes = { id: this._.playerID, name: this._.playerID };//attributes
			var baseURL = Player.local ? '' : 'http://player.grabnetworks.com/v5' + env + '/';
			swfobject.embedSWF(baseURL + 'Player.swf', divID, width, height, '9.0.0', false, flashvars, params, attributes, this._.setSWF);
			Player._ = Player._ || { players:[] };
			Player._.players[id] = this;
		},//Player
        on: function(eventName, doThis, asThis) {
          asThis = asThis || this;
          this._.eventListeners[eventName] = this._.eventListeners[eventName] || [];
          this._.eventListeners[eventName].push(enclose(asThis, doThis));
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
        loadNewVideo: function(guid) {
          this._.defer(this, function() {

            this._.swf.loadNewVideo(guid);
          });
        },
        toggleDebug: function() {
          this._.defer(this, function() {
            this._.swf.toggleDebug();
          });
        },
        stopVideo: function() {
          this._.defer(this, function() {
            this._.swf.stopVideo();
          });
        },
        showEmbed: function() {
          this._.defer(this, function() {
            this._.swf.showEmbed();
          });
        },
        hideEmbed: function() {
          this._.defer(this, function() {
            this._.swf.hideEmbed();
          });
        },
        hideInfo: function() {
          this._.defer(this, function() {
            this._.swf.hideInfo();
          });
        },
        showInfo: function() {
          this._.defer(this, function() {
            this._.swf.showInfo();
          });
        },
        showSharing: function() {
          this._.defer(this, function() {
            this._.swf.showSharing();
          });
        },
        hideSharing: function() {
          this._.defer(this, function() {
            this._.swf.hideSharing();
          });
        },
        showEmail: function() {
          this._.defer(this, function() {
            this._.swf.showEmail();
          });
        },
        hideEmail: function() {
          this._defer(this, function() {
            this._.swf.hideEmail();
          });
        },
        pauseVideo: function() {
          this._.defer(this, function() {
            this._.swf.pauseVideo();
          });
        },
        playVideo: function() {
          this._.defer(this, function() {
            this._.swf.playVideo();
          });
        },
        replayVideo: function() {
          this._.defer(this, function() {
            this._.swf.replayVideo();
          });
        },
        seekVideoTo: function(percent) {
          this._.defer(this, function() {
            this._.swf.seekVideoTo(percent)
          });
        },
        seekVideoToMS: function(milliseconds) {
          this._.defer(this, function() {
            this._.swf.seekVideoToMS(milliseconds);
          });
        },
        setVolume: function(level) {
          this._.defer(this, function() {
            this._.swf.setVolume(level);
          });
        },
        mute: function() {
          this._.defer(this, function() {
            this._.swf.mute();
          });
        },
        skipAd: function() {
          this._.defer(this, function() {
            this._.swf.skipAd();
          });
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
)