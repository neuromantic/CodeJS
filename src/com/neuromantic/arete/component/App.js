/*!
 *
 * App.js
 * com.neuromantic.arete.component.App
 *
 */
_package( 'com.neuromantic.arete.component',
	
 	_import( 'com.neuromantic.arete.component.Component' ),
 	
	_class( 'App' )._extends( 'Component', {
		private_settings : {},
		App : function ( settings ) {
			this._.settings = settings ;
            var scripts = document.getElementsByTagName( 'script' );
            this._.script = scripts[ scripts.length-1 ];
        },
        private_script : null,
		connect : function ( component ){
			this._super().connect( component );
			this.emit( { config : this._.settings } );
		}//,
	})
);