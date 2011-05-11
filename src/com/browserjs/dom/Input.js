/*!
 *
 * Input.js
 * com.browser.js.dom.Input
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('Input')._extends('TextField', {
	init : function( type ){
		this.element( document.createElement( 'input' ) );
		this.element().setAttribute('type', type);
	}
});
