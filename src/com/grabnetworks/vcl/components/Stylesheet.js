/*!
 *
 * StyleSheet.js
 * com.grabnetworks.vcl.components.StyleSheet
 *
 */
_package( 'com.grabnetworks.vcl.components',

     _import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'StyleSheet' )._extends( 'Component', {
		private_load : function ( url ) {
            if(document.createSyleSheet){
                return document.createSyleSheet( url );
            }
            var link = new Element('link', {type:"text/css", rel: 'stylesheet', href: url});
            document.getElementsByTagName('head')[0].appendChild( link );
		},
		config: function( config ) {
			if( config.stylesheet ) {
				this._.load( config.stylesheet );
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