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
        // private_playerContainer : null, 
        private_player : null,
        private_ready: false,
        private_onWindowLoad: function (){
            this._.ready = true;
            this._.render();
        },
        private_build : function () {
            if(this._.ready && this._.playlist) {
_trace( 'Vidifying your page...' );
                var productOptions = this._.options.grabnetworks.vidify;
                if( productOptions ){
_trace( 'Vidify Options:', productOptions );
                    var badge = productOptions.badge || { style: { bottom: '0px', right: '0px' } };
                    badge.style.position = 'absolute';
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
                    if( w > 300 && h > 168 && area > best && img.viewable() ) {
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
                    var parent, dw, dh;
                    while( element && element.tag().parentNode !== document ) {
                        parent = element.parent();
                        if(parent ) {
                            dw = parent.width() - element.width();
                            dh = parent.height() - element.height();
_trace( dw, dh );
                            if( parent.tag().href || ( element.isOnlyChildOf( parent ) && dw <= 20 && dh <= 20 ) ) {
_trace( 'clearing surrounding container with href =', parent.tag().href, ', or dw =', dw, ', or dh =', dh );
                                parent.replace( element );
                            }else{
                                element = null;
                            }
                        }
                    }
                    // this._.playerContainer = new Div({id:'playerContainer'});
                    // this._.playerContainer.x( 0 );
                    // this._.playerContainer.y( 0 );
                    // this._.playerContainer.z( 10001 );
                    // this._.badger.append( this._.playerContainer );
                }else{
                    //inject a player at the top of the root//root.
                }
            }
            new Ping( { p:'vf', e:'render', i:this._.settings.id });
        },
        private_addEvents : function () {
            if( this._.badgeImg ) {
                this._.badgeImg.on( MouseEvent.CLICK, this._.onBadgerClicked );
                // this._.badgeImg.on( MouseEvent.OVER, this._.onBadgeImgOver );
                // this._.badgeImg.on( MouseEvent.OUT, this._.onBadgeImgOut );
                this._.badgeImg.on(LoadingEvent.COMPLETE, this._.onImgLoaded );
            }
        },
        private_onImgLoaded : function ( event ){
            this._.layout();
        },
        private_layout: function () {
            // if( this._.playerContainer ) {
            //     this._.playerContainer.width( this._.target.width() );
            //     this._.playerContainer.height( this._.target.height() );
            // }
        },
        private_onBadgerClicked : function ( event ){
            new Ping( { p : 'vf', e : 'action', i : this._.settings.id, t : 'click_badge' } );
            this._.playVideo(); 
        },
        // private_onBadgeImgOver : function ( event ){
        //     this._.playerContainer.style( { backgroundColor : 'rgba(0,0,0,0.5)' } );
        // },
        // private_onBadgeImgOut : function ( event ){
        //     this._.playerContainer.style( { backgroundColor : 'transparent' } );
        // },
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
_trace('Playing video.');
                this._.settings.diag = 'console';
                this._.settings.target = this._.badger;
                this._.settings.config = this._.options;
                this._.settings.content = false;
                if(! this._.player ){
_trace( 'creating player');
                    this._.closeButton = new CloseButton();
                    this._.closeButton.style( { position: 'absolute', top: '-10px', right: '-10px', zIndex : 10005 } );
                    this._.closeButton.on( MouseEvent.CLICK, this._.onCloseButtonClicked );
                    this._.badger.append( this._.closeButton );
                    this._.player = new Player( this._.settings );
                    this._.player.style( { position: 'absolute' } );//XXX: can this be less manual?
                    this._.player.on( PlayerEvent.VIDEO_ENDED, this._.onPlayerVideoEnded);
                    this._.player.renderPlaylist( this._.playlist );
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