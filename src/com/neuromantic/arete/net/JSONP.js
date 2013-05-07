/*!
 *
 * JSONP.js
 * com.neuromantic.arete.net.JSONP
 *
 */
_package( 'com.neuromantic.arete.net',
    _import( 'com.neuromantic.arete.events.Notifier' ),
    _import( 'com.neuromantic.arete.dom.elements.Script' ),
    _import( 'com.neuromantic.arete.dom.document.Head' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _class( 'JSONP' )._extends( 'Notifier', {
        private_padding : 'jsonp',
        private_uid : null,
        private_script : null,
        static_receivers : [],
        private_onJSONP : function ( data ){
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
//          JSONP.receivers[ this._.uid ] = null;
//            this._.script.remove();
        },
        JSONP: function ( padding ){
            if( padding ){
                this._.padding = padding;
            }
        },
        load: function ( url ){
            this._.uid = JSONP.receivers.length;
            com.neuromantic.arete.net.JSONP.receivers.push(this._.onJSONP);
            var callback = 'com.neuromantic.arete.net.JSONP.receivers[' + this._.uid + ']';
            this._.script = document.createElement( 'script' );
            var token = ( url.indexOf('?') < 0 ) ? '?' : '&';
            var scriptSrc = url + token + this._.padding + '=' + callback;
            this._.script = new Script({ type : 'text/javascript', language:'javascript', src : scriptSrc });
            Head.element().append( this._.script );
        }
 	})
);