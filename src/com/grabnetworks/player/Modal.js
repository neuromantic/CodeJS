/*!
 *
 * Modal.js
 * com.grabnetworks.player.Modal
 *
 */
_package('com.grabnetworks.player',
    _import( 'com.neuromantic.arete.dom.elements.Div' ),
    _import( 'com.neuromantic.arete.dom.elements.media.Img' ),
    _import( 'com.neuromantic.arete.dom.document.Body' ),
    
    _import( 'com.grabnetworks.ui.CloseButton' ),
    _import( 'com.grabnetworks.player.Player' ),
    _import( 'com.grabnetworks.player.PlayerEvent' ),
    _import( 'com.grabnetworks.proto.GrabApp' ),
    _class( 'Modal', {
        private_overlay : null,
        private_container : null,
        private_closeButton : null,
        private_build : function () {
            this._.overlay = new Div( { id: 'grabOverlay' + this._.settings.id } );
            this._.container = new Div( { id: 'grabContainer' + this._.settings.id });
            this._.closeButton = new CloseButton( { id: 'grabClose' + this._.settings.id });
            this._.overlay.style({
                position : 'fixed',
                top : '0%',
                left : '0%',
                width : '100%',
                height : '100%',
                backgroundColor : 'black'
            });
            this._.overlay.alpha( 0.8 );
            this._.container.style( {
                backgroundColor : 'black',
                position : 'fixed',
                top : '50%',
                left : '50%',
                marginTop : -this._.settings.height * 0.5 + 'px',
                marginLeft : -this._.settings.width * 0.5 + 'px'
            } );
            this._.container.width( this._.settings.width );
            this._.container.height( this._.settings.height );
            this._.closeButton.style({
                position : 'fixed',
                top : '50%',
                left : '50%',
                marginTop : ((-this._.settings.height * 0.5) - 15) + 'px',
                marginLeft : ((this._.settings.width * 0.5) - 15) + 'px'
            });
            var body = Body.element();
            body.append( this._.overlay );
            body.append( this._.container );
            body.append( this._.closeButton );
            this._.settings.target = this._.container;
            this._.settings.autoPlay = true;
            this._.settings.content = false;
            this.player = new Player( this._.settings );
            this.hide();
        },
        private_addEvents : function(){
            this.player.onReady = this.close;
            this.player.on(PlayerEvent.ENDED, this._.onPlayerEnded );
            this._.closeButton.on(MouseEvent.CLICK, this._.onCloseButtonClick );
        },
        private_onCloseButtonClick : function( event ){
            this.close();
        },
        private_onPlayerEnded : function( event ){
            this.close();
        },
        Modal : function ( settings ) {
            this._.settings = settings;
            this._.build();
            this._.addEvents();
        },
        player : null,
        hide: function() {
            global.GRAB_API_METHODS = null;
            this._.overlay.visible( false );
            this._.container.visible( false );
            this.player.hide();
            this._.closeButton.visible( false );
            this._.overlay.onclick = null;
            this._.closeButton.onclick = null;
        },
        close: function() {
            this.player.stopVideo();
            this.hide();
        },
        show: function() {
            var z = 16777250;
            this._.overlay.visible( true );
            this._.overlay.z( z++ );
            this._.container.visible( true );
            this._.container.z( z++ );
            this.player.show();
            this.player.z( z++ );
            this._.closeButton.visible( true );
            this._.closeButton.z( z++ );
            this._.closeButton.onclick = this.hide;
            this._.overlay.onclick = this.hide;
        },
        play: function(guid) {
            this.show();
            if (guid) {
                this.player.loadNewVideo(guid);
            }else{
                this.player.playVideo();
            }
            this._.closeButton.onclick = this.close;
            this._.overlay.onclick = this.close;
        } //,
    })
)    