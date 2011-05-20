/*!
 *
 * Sprite.js
 * com.fasejs.display.Sprite
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.display',

 	_import( 'com.fasejs.display.Graphics' ),
 	_import( 'com.fasejs.display.DisplayObject' ),
 	
	_class( 'Sprite' )._extends( 'DisplayObject', {
		_graphics : null,
		graphics : function () {//read only
			return this._graphics || ( this._graphics = new Graphics( this ) );
			
		}
	})
);