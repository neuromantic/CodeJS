/*!
 *
 * Vidify.js
 * com.grabnetworks.vidify.Vidify
 *
 */
_package( 'com.grabnetworks.vidify',
    _import( 'com.grabnetworks.player.Player' ),
    _import( 'com.grabnetworks.vidify.Badger' ),
    _import( 'com.grabnetworks.ui.CloseButton' ),
    _import( 'com.grabnetworks.loading.ContentLoader' ),
    _import( 'com.grabnetworks.loading.CatalogLoader' ),
    _import( 'com.grabnetworks.tracking.Ping' ),
    _import( 'com.grabnetworks.tracking.PlaybackPinger' ),
    
    _import( 'com.neuromantic.arete.dom.Window' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
    _import( 'com.neuromantic.arete.dom.elements.media.Img' ),
    _import( 'com.neuromantic.arete.fx.Tween' ),
    _import( 'com.neuromantic.arete.events.MouseEvent' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _import( 'com.neuromantic.arete.data.Dictionary'),
    _class( 'Vidify', {
        private_badger : null,
        private_badgeImg : null,
        private_badgerClicked: false,
        private_target : null,
        private_closeButton : null,
        private_container : null, 
        private_player : null,
        private_playerSettings : {},
        private_options:null,
        private_content : null,
        private_ready: false,
        private_onOptionsLoaded: function ( event ){
            var contentID;
            var options = event.data;
            var productOptions = options.grabnetworks.vidify ||  options.grabnetworks.product;
_trace( 'Received Options', productOptions );
            if( productOptions ){
                this._.badgeImg.tag( productOptions.badge );
                this._.target = productOptions.target || this._.target;
                var pages = productOptions.pages;
                var url = location.href;
                var page;
                var score = 0;
                var length = 0;
                if( pages ){
                    for( var i = 0; i < pages.length; i++ ){
                        page = pages[ i ];
                        length = page.url.length;
                        if( page.url = '*' ||  ( url.indexOf( page.url) > -1 && length > score ) ){
                            contentID = page.content;
                            score = length;
                        }
                    }
                }
                contentID = this._.playerSettings.content || contentID;
                if(contentID){
                    new Ping( { p:'vf', e:'load', i:this._.playerSettings.id, u: encodeURIComponent(url) } );
_trace( 'Page found in whitelist' );
                    var loader = new MetaLoader();
                    loader.on(LoadingEvent.COMPLETE, this._.onContentLoaded)
                    loader.load( contentID );
                }
            }else{
_trace( 'Options do not contain vidify config.');
            }
            this._.options = event.data;
        },
        private_onWindowLoad: function (){
_trace( 'Window ready...' );
            this._.ready = true;
            this._.badge();
        },
        private_onContentLoaded : function ( event ){
          this._.content = event.data;
          this._.badge();
        },
        private_onBadgerClicked : function ( event ){
            new Ping( { p:'vf', e:'action', i:this._.playerSettings.id, t : 'click_badge' });
            this._.playVideo(); 
        },
        private_onBadgeImgOver : function ( event ){
            this._.container.style( { backgroundColor : 'rgba(0,0,0,0.5)' } );
        },
        private_onBadgeImgOut : function ( event ){
            this._.container.style( { backgroundColor : 'transparent' } );
        },
        private_onCloseButtonClicked : function ( event ) {
            new Ping( { p:'vf', e:'action', i:this._.playerSettings.id, t : 'click_close' });
            this._.player.hide();  
            this._.badger.visible( true );
            this._.closeButton.visible( false );
        },
        private_onPlayerVideoEnded : function ( event ) {
            this._.player.hide();  
            this._.badger.visible( true );
            this._.closeButton.visible( false );
        },
        private_badge : function (){
            if(this._.guid &&  this._.ready ) {
_trace( 'Badging your page...' );
                var root = Document.element();
                if(this._.target){
                    root = root.first( this._.target );
                    
                }
                var TARGET_RATIO = 1.77777778;
                var target, best = 0, area, img, images, ratio, match;
                images = root.find( Img );
                for ( var i = 0; i < images.length; i++ ) {
                    img = images[i];
                    area = img.width() * img.height();
                    ratio = img.width() / img.height();
                    proximity = 1 - Math.abs( TARGET_RATIO - ratio );
                    match = area * proximity;
                    if( match > best ) {
                        target = img;
                        best = match;
                    }
                }
                if(target){
_trace( 'Badging image with src =',target.tag().src, '...' );
                    this._.badger = new Badger( target, this._.badgeImg );
                    this._.badger.on( MouseEvent.CLICK, this._.onBadgerClicked );
                    this._.badgeImg.on( MouseEvent.OVER, this._.onBadgeImgOver );
                    this._.badgeImg.on( MouseEvent.OUT, this._.onBadgeImgOut );
                    this._.playerSettings.width = target.width();
                    this._.playerSettings.height = target.height();
                    this._.playerSettings.content = this._guid;
                    var element = this._.badger;
                    var parent;
                    while( element && element.tag().parentNode !== document ) {
                        parent = element.parent();
                        if(parent && parent.tag().href){
_debug( 'clearing surrounding hyperlink with href =', parent.tag().href, '.' );
                            parent.parent().replace( element, parent );
                        }
                        element = parent;
                    }
                    
                this._.container = new Div( { style : { position : 'absolute', top : 0,  left : 0, zIndex : 10001 } } );
                this._.container.width( target.width() );
                this._.container.height( target.height() );
                    this._.badger.append( this._.container );
                new Ping( { p:'vf', e:'render', i:this._.playerSettings.id });
                }
            }
        },
        private_playVideo : function (){
_trace('Playing video.')
                this._.playerSettings.content = this._.guid;
                // this._.playerSettings.diag = 'console';
                this._.playerSettings.parent = this._.container.tag();
                if(! this._.player ){
                    this._.player = new Player( this._.playerSettings );
                    this._.closeButton = new CloseButton();
                    this._.closeButton.style( { position: 'absolute', top: '-10px', right: '-10px', zIndex : 10005 } );
                    this._.closeButton.on( MouseEvent.CLICK, this._.onCloseButtonClicked );
                    this._.badger.append( this._.closeButton );
                    this._.player.on( PlayerEvent.VIDEO_ENDED, this._.onPlayerVideoEnded);
                    new PlaybackPinger( this._.player, 'vf' );
                }
                this._.badger.visible( false );
                this._.closeButton.visible( true );
                this._.closeButton.alpha( 0 );
                Tween.to( this._.closeButton, 0.5, { alpha: 1 } );
                this._.player.show(); 
        },
        Vidify : function( settings ){
            settings.id = settings.id || 1720202;
            this._.playerSettings = settings;
            new Ping( { p:'vf', e:'init', i:this._.playerSettings.id });
            this._.badgeImg = new Img( { src: 'http://static.grab-media.com/images/badges/playS.png', style: { bottom:'0px', right:'0px' } } );
            if( settings.badge ){
                this._.badgeImg.tag( { src : decodeURIComponent( settings.badge ) });
            }
            Window.onLoad( this._.onWindowLoad );
            var loader = new ContentLoader();
            loader.on( LoadingEvent.LOADED, this._.onOptionsLoaded );
            loader.loadOptions( settings.id );
        },
    })
);
    