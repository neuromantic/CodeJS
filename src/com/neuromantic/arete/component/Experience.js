/*!
 *
 * App.js
 * com.neuromantic.arete.component.App
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Container' ),
 	
	_class( 'Experience' )._extends( 'Container', {
		private_config : {},
		connect : function ( component ){
			this._super().connect( component );
			this.emit( {config : this._.config} );
		},
		Experience : function ( config ) {
			this._super();
			this._.config = config;
		}//,
	} )
);