/*!
 *
 * Experience.js
 * com.neuromantic.arete.component.widget.Experience
 *
 */
_package( 'com.neuromantic.arete.component.widget',
 	_import( 'com.neuromantic.arete.component.widget.Container' ),
 	
	_class( 'Experience' )._extends( 'Container', {
		connect : function ( component ){
			this._super().connect( component );
			this.emit( { config : this._.settings } );
		},
		config : function ( settings ){
			this._super().config(settings);
			delete this._.settings.parent;
		},
		process : function ( message ) {
			if( message.config ){
				return this.emit( { render: message.config } );
			}
			this._super().process( message );
		}//,
	} ) 
);