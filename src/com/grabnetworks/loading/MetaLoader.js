/*!
 *
 * ContentLoader.js
 * com.grabnetworks.loading.ContentLoader
 *
 */
_package( 'com.grabnetworks.loading',
    _import( 'com.neuromantic.arete.net.JSONP' ),
     
    _class( 'CatalogLoader' )._extends( 'JSONP', {
        private_server : 'http://catalog.grabnetworks.com',
        ContentLoader : function( environment ){
            switch( environment ){
                case 'qa':
                    this._.server = 'http://catalog.grabqa.com';
                    break;
                case 'test' :
                    this._.server = 'http://catalog0.grabtest.com:8080';
                    break;
            }
            this._super( 'jsonp' );
        },
        loadMatch : function (){
            var href = encodeURIComponent( global.location.href.toString() );
            this.super().load( this._.server + '/catalogs/1/videos/search?search_debug=1&catalog_id=1&date_weight=25.0&search_algo=match&url=' + href );   
        },
        loadSimilar : function (){
            var href = encodeURIComponent( global.location.href.toString() );
            this.super().load( this._.server + '/catalogs/1/videos/search?search_debug=1&catalog_id=1&date_weight=25.0&grabBoost=20.0&vcl_search=1&url=' + href ); 
        }
    })
);
        