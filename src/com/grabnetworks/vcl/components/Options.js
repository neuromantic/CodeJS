/*!
 *
 * Options.js
 * com.grabnetworks.vcl.components.Options
 *
 */
_package( 'com.grabnetworks.vcl.components',

     _import( 'com.neuromantic.arete.component.Component' ),
     _import( 'com.neuromantic.arete.net.JSONP' ),
     
	_class( 'Options' )._extends( 'Component', {
        private_loader : null,
        private_server: 'http://content.grabnetworks.com/',
		private_load : function ( embedID ) {
            this._.loader = new JSONP( 'jsonp' );
            this._.loader.on( LoadingEvent.LOADED, this._.onLoaded );
            this._.loader.load(  this._.server + '/options/' + embedID + '.json');
		},
        private_onLoaded : function ( event ){
                this.emit({content:event.data.grabnetworks.content});
        },
		config: function( config ) {
			if( config.id ) {
				this._.load( config.id );
			}
		}//,
	} )
);