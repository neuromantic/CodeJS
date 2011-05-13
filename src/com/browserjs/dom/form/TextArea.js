/*!
 *
 * TextArea.js
 * com.browser.js.dom.TextArea
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('TextArea')._extends('Input', {
	init : function( placeholderText ){
		this.element( document.createElement( 'textarea' ) );
		if(placeholderText !== undefined){
			this.element().setAttribute( 'placeholder', placeholderText );
		}
	}
});
