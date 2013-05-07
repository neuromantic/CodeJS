_package( 'net.kolektiv.proto',
	_import( 'com.fasejs.display.Sprite' ),
	_import( 'com.fasejs.events.Event' ),
	_import( 'com.fasejs.util.Dictionary' ),
	
	_class(  'ExecSprite' )._extends( 'Sprite',  {
		private_height : null,
		height : function ( value ) {
			if( value === undefined ) {			
				return this._.height || this._super().height.call( this );
			}
			this._.height = value;
			this._layout();
		},
		private_width : null,
		width : function ( value ) {
			if( value === undefined ) {	
				return this._.width || this._super().width.call( this );
			}
			this._.width = value
			this._layout();
		},
		ExecSprite : function ( hostElement ) {
// _debug( 'new ExecSprite', hostElement );
			this._super( hostElement );
		},
		exec : function () {
_debug( this, 'exec' );
			this._setup();
			this._build();
			if ( this.stage() ) {
				this._stageReady();
			} else {
_debug( this, 'waiting for stage')
				this.addEventListener( Event.ADDED_TO_STAGE, this._addedToStageListener, this );
			};
		},
		trigger : function () {
_debug( this, 'trigger' );
			this._init();
			this._start();
		},
		hide : function () {
			this.visible( false );
		},
		show : function () {
			this.visible( true );
		},
		_init : function () {
_debug( this, '_init' );
		},
		_start : function () {
_debug( this, '_start' );
		},
		_stop : function () {
_debug( this, '_stop' );
		},
		_addEvents : function () {
_debug( this, '_addEvents' );
		},
		_addedToStageListener : function ( event ) {
			this.removeEventListener( Event.ADDED_TO_STAGE, this._addedToStageListener, this );
			this._stageReady();
		},
		_build : function () {
_debug( this, '_build' );
		},
		_draw : function () {
_debug( this, '_draw' );
		},
		_layout : function( animated ) {
_debug( this, '_layout' );

		},
		_setup : function () {
_debug( this, '_setup' );
		},
		_stageReady : function () {
_debug( this, 'has stage')
			this._addEvents();
			this._layout( false );
			this.trigger();
		},
	})
);