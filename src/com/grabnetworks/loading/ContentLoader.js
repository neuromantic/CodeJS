/*!
 *
 * ContentLoader.js
 * com.grabnetworks.loading.ContentLoader
 *
 */
_package( 'com.grabnetworks.loading',
    _import( 'com.neuromantic.arete.net.JSONP' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
     
    _class( 'ContentLoader' )._extends( 'JSONP', {
        private_server : 'http://content.grabnetworks.com',
        ContentLoader : function( environment ){
            switch( environment ){
                case 'qa':
                    this._.server = 'http://content.grabqa.com';
                    break;
            }
            this._super( 'jsonp' );
        },
        loadOptions : function ( embedID ){
            this._super().load(  this._.server + '/options/' + embedID + '.json' );
        },
        loadContent : function ( contentID ){
            var guid;
			switch ( contentID.length ) {
				case 40:
					guid = contentID;
					break;
				case 41:
					guid = contentID.substr( 1 );
					break;
				default:
					throw new Error( 'Invalid GUID length' );
			}
            var href = encodeURIComponent(Document.url());
            this.load(  this._.server + '/' + guid + '?from=' + href );
        }
    })
);
        