/*!
 *
 * Component.js
 * com.neuromantic.arete.component.Component
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Emitter' ),
 	
	_class( 'Component' )._extends( 'Emitter', {
		private_settings: {},
		Component: function ( config ){
			if( config ){
				this.config( config );
			}
		},
		config : function( config ){
			this._.settings = config;
		},
		input : function ( message ) {
			if(message.config){
				this.config( message.config )
			}
			this._super().input( message );
		},
		connect : function( receiver ) {
			this._.connections.push( receiver );
		},
		disconnect : function ( receiver ){
			this._.connections.splice( this._.connections.indexOf( receiver ), 1 );
		}
	} )
);