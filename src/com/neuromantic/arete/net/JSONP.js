/*!
 *
 * JSONP.js
 * com.neuromantic.arete.events.Event
 *
 */
_package( 'com.neuromantic.net',
    _import('com.neuromantic.arete.events.Notifier'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _class( 'JSONP')._extends( 'Notifier', {
        private_padding : 'jsonp',
        private_uid : null,
        private_script : null,
        static_receivers : [],
        private_onJSONP : function ( data ){
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
            JSONP.receivers.splice( this._.uid, 1)
        },
        JSONP: function ( padding ){
            if( padding ){
                this._.padding = padding;
            }
        },
        load: function ( url ){
            this._.uid = JSONP.receivers.length;
            JSONP.receivers[this._.uid] = this._.onJSONP;
            this._.script = document.createElement('script');
            var token = ( url.indexOf('?') < 0 ) ? '?' : '&';
            this._.script.src = url + token + this._.padding + '='+'JSONP.receivers[' + uid + ']';
            document.getElementsByTagName( 'head' )[0].appendChild( this._.script );
        }
 	})
);