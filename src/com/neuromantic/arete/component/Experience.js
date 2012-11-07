/*!
 *
 * Experience.js
 * com.neuromantic.arete.component.Experience
 *
 */
_package( 'com.neuromantic.arete.component',
 	_import( 'com.neuromantic.arete.component.Container' ),
 	
	_class( 'Experience' )._extends( 'Container', {
		connect : function ( component ){
			this._super().connect( component );
			this.emit( {config : this._.settings} );
		},
		process : function ( message ) {
			if( message.config){
_debug('config complete', this, 'rendering.', Code._.util.stringify(message));
				return this.emit( { render: message.config });
			}
			this._super().process( message );
			
		},
		config: function ( settings ) {
			this._super().config( settings );
			if(settings.parent){
				settings.parent.appendChild( this.element );
			}
		}
	} )
);