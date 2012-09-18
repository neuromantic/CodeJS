/*!
 *
 * Filmstrip.js
 * com.grabnetworks.vcl.components.widgets.Filmstrip
 *
 */
_package( 'com.grabnetworks.vcl.components.widgets',

 	_import( 'com.neuromantic.arete.component.Widget' ),
 	
	_class( 'Filmstrip' )._extends( 'Widget', {
		config: function( config ){
		},
		process : function ( message ) {
			if(message.videos){
				return this._.element.innerHTML = JSON.stringify( message.videos ).replace(/{/g,'{\n').replace(/}/g,'}\n');
			}
			this.super().process( message );
		}
	} )
);