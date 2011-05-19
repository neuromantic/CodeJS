/*!
 *
 * Loader.js
 * com.fasejs.display.Loader
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class( 'Loader' )._extends( 'Bitmap', {
	Loader : function ( url ) {
		this._super();
		this.element().src = url;
	}
});