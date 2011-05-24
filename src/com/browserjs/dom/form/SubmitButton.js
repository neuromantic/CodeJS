/*!
 *
 * SubmitButton.js
 * com.browser.js.dom.form.SubmitButton
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
// _package( 'com.browserjs.dom.form',

	// _import( 'com.browserjs.dom.form.Input' ),
	
	_class('SubmitButton')._extends('Input', {
		SubmitButton : function( label ){
			this.element( document.createElement( 'input' ) );
			this.element().setAttribute('type', 'submit')
			if(label !== undefined){
				this.element().value = label;
			};
		}//,
	}//,
);
