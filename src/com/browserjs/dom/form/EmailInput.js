/*!
 *
 * EmailInput.js
 * com.browser.js.dom.EmailInput
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('EmailInput')._extends('Input', {
	init : function( placeholderText ){
		this.element( document.createElement( 'Input' ) );
		this.element().setAttribute('type', 'email')
		if(placeholderText !== undefined){
			this.element().setAttribute( 'placeholder', placeholderText );
		}
	},
});
