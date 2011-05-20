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
 _package( 'com.fasejs.display',
 	_import( 'com.fasejs.display.Bitmap' ),
	_class( 'Loader' )._extends( 'Bitmap', {
		Loader : function ( url ) {
			this._super();
			this.element().src = url;
		}//,
	}//,
));