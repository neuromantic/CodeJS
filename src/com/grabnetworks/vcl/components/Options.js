/*!
 *
 * Options.js
 * com.grabnetworks.vcl.components.Options
 *
 */
_package( 'com.grabnetworks.vcl.components',

     _import( 'com.neuromantic.arete.component.Component' ),
     _import( 'com.neuromantic.arete.dom.Element'),
     _import( 'com.neuromantic.arete.net.JSONP' ),
     
	_class( 'Options' )._extends( 'Component', {
        private_loader : null,
        private_server: 'http://content.grabnetworks.com/',
		private_load : function ( embedID ) {
            this._.loader = new JSONP( 'jsonp' );
            this._.loader.on( LoadingEvent.LOADED, this._.onLoaded );
            this._.loader.load(  this._.server + '/options/' + embedID + '.json');
		},
        private_processSkin : function( url ){
            if( url.indexOf( '.css') > -1 ){
                if(document.createSyleSheet){
                    document.createSyleSheet( skin );
                }else{
                    var link = new Element('link', {type:"text/css", rel: 'stylesheet', href: url});
                    document.getElementsByTagName('head')[0].appendChild( link.tag() );
                }
            }else{
_trace( 'no css skin:', url );
            }
        },
        private_onLoaded : function ( event ){
            this._.processSkin( event.data.grabnetworks.skin );
            this.emit({content:event.data.grabnetworks.content});
        },
		config: function( config ) {
			if( config.id ) {
				this._.load( config.id );
			}
		}//,
	} )
);