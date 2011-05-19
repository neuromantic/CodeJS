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
_class( 'Sprite' )._extends( 'DisplayObject', {
	_graphics : null,
	graphics : function () {//read only
		return this._graphics || ( this._graphics = new Graphics( this ) );
		
	}
});