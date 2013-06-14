/*!
 *
 * Component.js
 * com.neuromantic.arete.proto.Component
 *
 */
_package( 'com.neuromantic.arete.proto',
	_import( 'com.neuromantic.arete.dom.elements.Div' ),
    _import( 'com.neuromantic.arete.events.ComponentEvent'),
	_class( 'Component' )._extends( 'Div',  {
		private_height : null,
		get_height : function () {	
				return this._.height || this._super().height();
		},
        set_height : function ( value ){
			this._.layout();
		},
		private_width : null,
		get_width : function ( value ) {
			return this._.width || this._super().width();
		},
        set_width : function ( value ){
			this._.layout();
		},
		Component : function ( atts ) {
			this._super( atts );
            this.x(0);
            this.y(0);
		},
		exec : function () {
//_trace( 'EXEC' );
			this._.setup();
            this._.render();
        	this.run();
		},
		run : function () {
//_trace( 'RUN' );
			this.init();
			this.start();
		},
		hide : function () {
			this.visible( false );
		},
		show : function () {
			this.visible( true );
		},
		init : function () {
//_trace( 'INIT' );
		},
		start : function () {
//_trace( 'START' );
		},
		stop : function () {
//_trace( 'STOP' );
		},
        append: function (child){
            child.style( { position: 'absolute' } );
            this._super().append( child );
        },
        private_render : function () {
    		this._.build();
			this._.layout( false );
            this._.addEvents();
            this._.notify( new ComponentEvent( ComponentEvent.RENDER ) );
        },
        private_destroy : function (){
//_trace( this, 'destroy');
        },
		private_addEvents : function () {
//_trace( this, 'addEvents' );
		},
    	private_build : function () {
//_trace( this, 'build' );
		},
		private_layout : function( animated ) {
//_trace( this, 'layout' );
    		this._super().width( this._.width );
    		this._super().height( this._.height );
		},
		private_setup : function () {
//_trace( this, 'setup' );
		}
	})
);