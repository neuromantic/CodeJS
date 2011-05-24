/*!
 *
 * Bitmap.js
 * com.fasejs.display.Bitmap
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.fasejs.display',

 	// _import( 'com.fasejs.display.DisplayObject' ),
 	
	_class( 'Bitmap' )._extends( 'DisplayObject', {
		Bitmap : function( contents ) {
			this._super( contents || document.createElement( 'img' ) );
		}
	}
);