/*!
 *
 * Experience.js
 * com.neuromantic.arete.component.Experience
 *
 */
_package( 'com.neuromantic.arete.component',
 	_import( 'com.neuromantic.arete.component.Container' ),
 	
	_class( 'Experience' )._extends( 'Container', {
		private_config : {},
		connect : function ( component ){
			this._super().connect( component );
			this.emit( {config : this._.settings} );
		},
		Experience : function ( settings ) {
			this._super();
			var scripts = document.getElementsByTagName( 'script' );
			var parent = scripts[ scripts.length - 1 ].parentNode;
			parent.appendChild( this.element );
			this._.settings = settings;
		}//,
	} )
);