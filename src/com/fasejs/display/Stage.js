/*!
 *
 * Stage.js
 * com.fasejs.display.Stage
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.fasejs.display',

	// _import( 'com.fasejs.display.Sprite' ),
 	// _import( 'com.fasejs.events.MouseEvent' ),
	
	_class( 'Stage' )._extends( 'Sprite', {
		Stage : function( hostElement ) {
			if ( hostElement.hasChildNodes() ) {
			    while ( hostElement.childNodes.length > 0 ) {
			    	var child = hostElement.firstChild;
			        hostElement.removeChild( child ); 
			    };
			};
			this._super( hostElement );
			this.name('stage')
			this.stage( this );
			this.addEventListener( MouseEvent.MOVE, this.onMouseMove );
			var _this = this;
			window.onresize = function ( e ) { _this._dispatchEvent( new Event( Event.RESIZE, _this) ) }
		},
		_measure : function () {},
		onMouseMove : function ( event ) {
			this.mouseX( event.mouseX );
			this.mouseY( event.mouseY );
			_trace( event.mouseY, event.mouseX );
		}//,
	}
);