/*!
 *
 * Content.js
 * com.grabnetworks.vcl.components.Content
 *
 */
_package( 'com.grabnetworks.vcl.components',

     _import( 'com.neuromantic.arete.component.Component' ),
     _import( 'com.neuromantic.arete.net.JSONP' ),
 	
	_class( 'Content' )._extends( 'Component', {
        private_guid : null,
        private_loader : null,
        private_server: 'http://content.grabnetworks.com/',
		private_load : function ( contentID ) {
            var type;
			var guid;
			switch ( contentID.length ) {
				case 40:
					guid = contentID;
					type = 'v';
					break;
				case 41:
					guid = contentID.substr( 1 );
					type = contentID.substr( 0, 1 );
					break;
				default:
					throw new Error( 'Invalid GUID length' );
			}
            var fromPage = escape(global.location.href.toString());
            this._.loader = new JSONP( 'jsonp' );
            this._.loader.on( LoadingEvent.LOADED, this._.onLoaded );
            this._.loader.load(  this._.server + '/' +  type + '/' + guid + '?from=' + fromPage );
            this._.guid = guid;
		},
        private_onLoaded : function ( event ){
                this.emit(event.data);
        },
		config: function( config ) {
			if( config.content ) {
				this._.load( config.content );
			}
		},
		process : function ( message ) {
			if( message.content && !this._.guid){
				this._.load( message.content);
			}
			this._super().process( message );
		}
	} )
);