/*!
 *
 * TextField.js
 * com.fasejs.text.TextField
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('Header')._extends('TextField', {
	init : function( element ){
		element || this.element(document.createElement('div'));
	}
});
