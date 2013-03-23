/*!
 *
 * Vidify.js
 * com.grabnetworks.vidify.Vidify
 *
 */
_package( 'com.grabnetworks.vidify',
    _import( 'com.grabnetworks.player.Player' ),
    _import( 'com.grabnetworks.vidify.Badger' ),
    _import( 'com.neuromantic.arete.dom.media.Img' ),
    _import( 'com.neuromantic.arete.dom.Window' ),
    _import( 'com.neuromantic.arete.events.MouseEvent' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _import( 'com.neuromantic.arete.net.JSONP' ),
    _class( 'Vidify', {
        private_badger : null,
        private_badgeOptions : { src: 'http://www4.grabtest.com:8080/img/curl.png', style: { bottom:'0px', right:'0px' } },
        private_target : 'document',
        private_player : null,
        private_playerSettings : {},
        private_options:{},
        private_guid : null,
        private_ready: false,
        private_optionsLoader_onLoaded: function ( event ){
_trace( 'Received Opitons...' );
            this._.options = event.data;
            if( this._.options.grabnetworks.vidify ){
                this._.badgeOptions = this._.options.grabnetworks.vidify.badge || this._.badgeOptions;
                this._.target = this._.options.grabnetworks.vidify.target || this._.target;
            }
            this._.vidify();
        },
        private_Window_onLoad: function (){
_trace( 'Window Ready...' );
            this._.ready = true;
            this._.vidify();
        },
        private_contentLoader_onLoaded : function ( event ) {
_trace( 'Received Content...' );
            this._.guid = event.data.response.results[ 0 ].video.guid;
            this._.vidify();
        },
        private_badger_onClick : function ( event ){
            if(! this._.player ){
                this._.player = new Player( this._.playerSettings );
                this._.player.on( PlayerEvent.VIDEO_ENDED, this._.player_onVideoEnded);
                this._.badger.visible( false );
            }
        },
        private_player_onVideoEnded : function ( event ) {
            this._.player.hide();  
            this._.badger.visible( true );
        },
        private_vidify : function (){
            if( this._.guid && this._.ready && this._.options ) {
_trace( 'Vidifying your page...' );
                var root = Element.find( this._.target );
                var target, biggest = 0;
                var images = document.getElementsByTagName('img');//.find( Img );
                for (var i = 0; i < images.length; i++){
                    var img = images[i];
                    var area = img.width() * img.height();
                    if( area > biggest ){
                        target = img;
                        biggest = area;
                    }
                }
_trace( 'badging image with src =',target.tag().src );
                this._.badger = new Badger( target, this._.badgeOptions );
                this._.playerSettings.width = target.width();
                this._.playerSettings.height = target.height();
                this._.playerSettings.content = this._.guid;
                var container = new Div( { style : { position : 'absolute', top : 0, left : 0, zIndex : 10000 } } );
                this._.badger.append( container );
                this._.playerSettings.parent = container.tag();
                this._.badger.on( MouseEvent.CLICK, this._.badger_onClick );
                var element = this._.badger;
                var parent;
                while( element && element.tag().parentNode !== document ) {
                    parent = element.parent();
                    if(parent && parent.tag().href){
_debug( 'clearing surrounding hyperlink with href =',parent.tag().href );
                        parent.parent().replace(element, parent);
                    }
                    element = parent;
                }
            }
        },
        Vidify : function( settings ){
            this._.playerSettings = settings;
            Window.onLoad( this._.Window_onLoad );
            var optionsLoader = new JSONP();
            optionsLoader.on( LoadingEvent.LOADED, this._.optionsLoader_onLoaded );
            optionsLoader.load( 'http://content.grabnetworks.com/options/'+settings.id+'.json' );
            var contentLoader = new JSONP();
            contentLoader.on( LoadingEvent.LOADED, this._.contentLoader_onLoaded );
            contentLoader.load( 'http://catalog.grabnetworks.com/catalogs/1/videos/search?search_debug=1&catalog_id=1&date_weight=25.0&grabBoost=20.0&vcl_search=1&url=' + encodeURIComponent( location.href ) );
        
        },
    })
);
    