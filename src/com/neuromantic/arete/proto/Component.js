/*!
 *
 * Component.js
 * com.neuromantic.arete.proto.Component
 *
 */
_package( 'com.neuromantic.arete.proto',
	_import( 'com.neuromantic.arete.dom.elements.Div' ),
	_class( 'Component' )._extends( 'Div',  {
		private_height : null,
		get_height : function () {	
				return this._.height || this._super().height();
		},
        set_height : function ( value ){
			this._super().height( value );
			this._.layout();
		},
		private_width : null,
		get_width : function ( value ) {
			return this._.width || this._super().width();
		},
        set_width : function ( value ){
			this._super().width( value );
			this._.layout();
		},
		Component : function ( atts ) {
			this._super( atts );
            this.x(0);
            this.y(0);
		},
		exec : function () {
_debug( this, 'exec' );
			this._.setup();
            this._.render();
		},
		run : function () {
_debug( this, 'run' );
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
_debug( this, 'init' );
		},
		start : function () {
_debug( this, 'start' );
		},
		stop : function () {
_debug( this, 'stop' );
		},
        append: function (child){
            child.style( { position: 'absolute' } );
            this._super().append( child );
        },
        private_render : function () {
    		this._.build();
			this._.layout( false );
            this._.addEvents();
    		this.run();
        },
		private_addEvents : function () {
_debug( this, 'addEvents' );
		},
    	private_build : function () {
_debug( this, 'build' );
		},
		private_layout : function( animated ) {
_debug( this, 'layout' );
		},
		private_setup : function () {
_debug( this, 'setup' );
		}
	})
);