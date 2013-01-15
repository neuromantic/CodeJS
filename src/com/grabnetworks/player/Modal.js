/*!
 *
 * Modal.js
 * com.grabnetworks.player.Modal
 *
 */
_package('com.grabnetworks.player',
    _import( 'com.grabnetworks.player.Player'),
    _import( 'com.grabnetworks.player.PlayerEvent'),
    _class( 'Modal', {
        private_overlay : null,
        private_container : null,
        private_closeButton : null,
        Modal : function ( settings ) {
            this._.overlay = document.createElement('div');
            this._.container = document.createElement('div');
            this._.closeButton = document.createElement('img');
            this._.overlay.id = 'grabOverlay' + settings.id;
            this._.overlay.style.position = 'fixed';
            this._.overlay.style.top = '0%';
            this._.overlay.style.left = '0%';
            this._.overlay.style.width = '100%';
            this._.overlay.style.height = '100%';
            this._.overlay.style.backgroundColor = 'black';
            this._.overlay.style.MozOpacity = 0.8;
            this._.overlay.style.opacity = 0.8;
            this._.overlay.style.filter = 'alpha(opacity=80)';
            this._.container.id = 'grabContainer' + settings.id;
            this._.container.style.backgroundColor = 'black';
            this._.container.style.position = 'fixed';
            this._.container.style.top = '50%';
            this._.container.style.left = '50%';
            this._.container.style.width = settings.width + 'px';
            this._.container.style.height = settings.height + 'px';
            this._.container.style.marginTop = -settings.height * 0.5 + 'px';
            this._.container.style.marginLeft = -settings.width * 0.5 + 'px';
            this._.container.style.overflow = 'hidden';
            this._.closeButton.id = 'grabClose' + settings.id;
            this._.closeButton.src = 'http://player.grabnetworks.com/js/img/close.png';
            this._.closeButton.style.position = 'fixed';
            this._.closeButton.style.top = '50%';
            this._.closeButton.style.left = '50%';
            this._.closeButton.style.marginTop = ((-settings.height * 0.5) - 15) + 'px';
            this._.closeButton.style.marginLeft = ((settings.width * 0.5) - 15) + 'px';
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(this._.overlay);
            body.appendChild(this._.container);
            body.appendChild(this._.closeButton);
            settings.parent = this._.container;
            settings.autoPlay = true;
            this.player = new Player(settings);
            this.hide();
            this.player.onReady = this.close;
            this.player.on(PlayerEvent.ENDED, this.close );
        },
        hide: function() {
            global.GRAB_API_METHODS = null;
            this._.overlay.style.display = 'none';
            this._.overlay.style.visibility = 'hidden';
            this._.container.style.display = 'none';
            this._.container.style.visibility = 'hidden';
            this.player.style.display = 'none';
            this.player.style.visibility = 'hidden';
            this._.closeButton.style.display = 'none';
            this._.closeButton.style.visibility = 'hidden';
            this._.overlay.onclick = null;
            this._.closeButton.onclick = null;
        },
        close: function() {
            this.player.stopVideo();
            this.hide();
        },
        show: function() {
            var z = 16777250;
            this._.overlay.style.display = 'block';
            this._.overlay.style.visibility = 'visible';
            this._.overlay.style.zIndex = z++;
            this._.container.style.display = 'block';
            this._.container.style.visibility = 'visible';
            this._.container.style.zIndex = z++;
            this.player.style.display = 'block';
            this.player.style.visibility = 'visible';
            this.player.style.zIndex = z++;
            this._.closeButton.style.display = 'block';
            this._.closeButton.style.visibility = 'visible';
            this._.closeButton.style.zIndex = z++;
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