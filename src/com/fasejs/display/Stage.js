/*!
 *
 * Stage.js
 * com.fasejs.display.Stage
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.display',

	_import( 'com.fasejs.display.DisplayObject' ),
 	// _import( 'com.fasejs.events.MouseEvent' ),
 	_import( 'com.fasejs.events.Event' ),
	
	_class( 'Stage' )._extends( 'DisplayObject', {
		
		Stage : function( hostElement ) {
// _debug( 'new Stage', hostElement );
			if ( hostElement.hasChildNodes() ) {
			    while ( hostElement.childNodes.length > 0 ) {
			    	var child = hostElement.firstChild;
			        hostElement.removeChild( child ); 
			    };
			};
			this._super( hostElement );
			this.name( 'stage' )
			this.stage( this );
			// this.addEventListener( MouseEvent.MOVE, this.onMouseMove );
			var _this = this;
			window.onresize = function ( e ) { _this._dispatchEvent( new Event( Event.RESIZE, _this) ) }
// _debug( 'Stage constructed.')
		},
		private_measure : function () {},
		// onMouseMove : function ( event ) {
			// this.mouseX( event.mouseX );
			// this.mouseY( event.mouseY );
			// // _trace( event.mouseY, event.mouseX );    
		// }//,
	})
);