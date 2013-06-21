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
    _import( 'com.grabnetworks.proto.GrabApp' ),
    
    _import( 'com.neuromantic.arete.dom.Window' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
    _import( 'com.neuromantic.arete.dom.elements.media.Img' ),
    _import( 'com.neuromantic.arete.fx.Tween' ),
    _import( 'com.neuromantic.arete.events.MouseEvent' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _import( 'com.neuromantic.arete.data.Dictionary'),
    _class( 'Vidify' )._extends( 'GrabApp', {
        private_badger : null,
        private_badgeImg : null,
        private_badgerClicked: false,
        private_target : null,
        private_closeButton : null,
        private_playerContainer : null, 
        private_player : null,
        private_ready: false,
        private_onWindowLoad: function (){
_trace( 'Window ready...' );
            this._.ready = true;
            this._.render();
        },
        private_build : function () {
            if(this._.ready ) {
_trace( 'Vidifying your page...' );
                var productOptions = this._.options.grabnetworks.vidify;
                if( productOptions ){
_trace( 'Vidify Options:', productOptions );
                    var badge = productOptions.badge || { style: { bottom: '0px', right: '0px' } };
                    if( this._.settings.badge){
                        badge.src = this._.settings.badge;
                    }
                    this._.badgeImg = new Img( badge );
                    this._.target = productOptions.target || this._.target;
                }else{
_trace( 'No Vidify config in Options file, please contact Grab.')
                    return;
                }
                var root = Document.element();
                if(this._.target){
                    root = root.first( this._.target );
                }
                var TARGET_RATIO = 16/9;
                var target, best = 0, w, h, area, img, images, ratio;
                images = root.find( Img );
                for ( var i = 0; i < images.length; i++ ) {
                    img = images[i];
                    w = img.width();
                    h = img.height();
                    ratio = img.width() / img.height();
                    if ( ratio > TARGET_RATIO){
                        w = h * TARGET_RATIO;
                    }else{
                        h = w / TARGET_RATIO;
                    }
                    area = w * h;
                    if( area > best ) {
                        target = img;
                        best = area;
                    }
                }
                if(target){
                    this._.target = target;
                    this._.settings.width = target.width();
                    this._.settings.height = target.height();
_trace( 'Badging image with src =',target.tag().src, '...' );
                    this._.badger = new Badger( this._.target, this._.badgeImg );
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
                    this._.playerContainer = new Div( { style : { position : 'absolute', top : 0,  left : 0, zIndex : 10001 } } );
                    this._.badger.append( this._.playerContainer );
                    new Ping( { p:'vf', e:'render', i:this._.settings.id });
                }
            }
        },
        private_addEvents : function () {
            if( this._.badger ) {
                this._.badger.on( MouseEvent.CLICK, this._.onBadgerClicked );
                this._.badgeImg.on( MouseEvent.OVER, this._.onBadgeImgOver );
                this._.badgeImg.on( MouseEvent.OUT, this._.onBadgeImgOut );
                this._.badgeImg.on(LoadingEvent.COMPLETE, this._.onImgLoaded );
            }
        },
        private_onImgLoaded : function ( event ){
            this._.layout();
        },
        private_layout: function () {
            if( this._.playerContainer ) {
                this._.playerContainer.width( this._.target.width() );
                this._.playerContainer.height( this._.target.height() );
            }
        },
        private_onBadgerClicked : function ( event ){
            new Ping( { p:'vf', e:'action', i:this._.settings.id, t : 'click_badge' });
            this._.playVideo(); 
        },
        private_onBadgeImgOver : function ( event ){
            this._.playerContainer.style( { backgroundColor : 'rgba(0,0,0,0.5)' } );
        },
        private_onBadgeImgOut : function ( event ){
            this._.playerContainer.style( { backgroundColor : 'transparent' } );
        },
        private_onCloseButtonClicked : function ( event ) {
            new Ping( { p:'vf', e:'action', i:this._.settings.id, t : 'click_close' });
            this._.hidePlayer();
        },
        private_hidePlayer : function (){
            this._.player.destroy(); 
            this._.player = null;
            this._.badger.visible( true );
            this._.closeButton.visible( false );
        },
        private_onPlayerVideoEnded : function ( event ) {
            this._.hidePlayer();
        },
        private_playVideo : function (){
_trace('Playing video.')
                this._.settings.diag = 'console';
                this._.settings.target = this._.playerContainer;
                this._.settings.config = this._.options;
                this._.settings.content = false;
                if(! this._.player ){
                    this._.closeButton = new CloseButton();
                    this._.closeButton.style( { position: 'absolute', top: '-10px', right: '-10px', zIndex : 10005 } );
                    this._.closeButton.on( MouseEvent.CLICK, this._.onCloseButtonClicked );
                    this._.badger.append( this._.closeButton );
                    this._.player = new Player( this._.settings );
                    this._.player.on( PlayerEvent.VIDEO_ENDED, this._.onPlayerVideoEnded);
                    this._.player.renderContent( this._.playlist.videos[0] );
                    this._.player.playVideo();
                    new PlaybackPinger( this._.player, 'vf' );
                }
                this._.badger.visible( false );
                this._.closeButton.visible( true );
                this._.closeButton.alpha( 0 );
                Tween.to( this._.closeButton, 0.5, { alpha: 1 } );
        },
        Vidify : function( settings ){
            this._super(settings);
            new Ping( { p:'vf', e:'init', i:this._.settings.id });
            Window.onLoad( this._.onWindowLoad );
        },
    })
);