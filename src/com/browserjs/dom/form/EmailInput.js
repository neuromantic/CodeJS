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
// _package( 'com.browserjs.dom.form',

	// _import( 'com.fasejs.events.FocusEvent' ),
	
	_class('EmailInput')._extends('Input', {
		EmailInput : function( placeholderText ){
			this.element( document.createElement( 'Input' ) );
			this.element().setAttribute('type', 'email')
			if(placeholderText !== undefined){
				this.element().setAttribute( 'placeholder', placeholderText );
			};
		}//,
	}//,
);
