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
_class( 'Stage' )._extends( 'Sprite', {
	init : function( hostElement ) {
		if ( hostElement.hasChildNodes() ) {
		    while ( hostElement.childNodes.length > 0 ) {
		    	var child = hostElement.firstChild;
		        hostElement.removeChild( child ); 
		    };
		};
		this.element( hostElement );
		this.stage( this );
	}
});