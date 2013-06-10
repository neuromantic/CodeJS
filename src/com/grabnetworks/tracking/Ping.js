/*!
 *
 * Ping.js
 * com.grabnetworks.tracking.Ping
 *
 */
_package( 'com.grabnetworks.tracking',
    _import( 'com.neuromantic.arete.dom.elements.media.Img' ),
    _class( 'Ping', {
        private_server : 'http://et.grabtest.com',
        private_route : '/ping',
        private_params: {},
        Ping : function ( params ){
            if ( params ){
                this.send( params );
            }
        },
        set_params : function ( params ){
            for ( var key in params ){
                this._.params[ key ] = params[ key ];
            }
        },
        get_params : function () {
            return this._.params;
        },
        send : function( attributes ){
           this.params(attributes);
           var query = '?';
           for( var key in this._.params){
               query += key + '=' + this._.params[ key ] + '&';
           }
           query = query.slice(0, -1);
           new Img({src : this._.server+this._.route+query});
        }
    })
);