/*!
 *
 * SubmitButton.js
 * com.browser.js.dom.form.SubmitButton
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.browserjs.dom.form',

	_import( 'com.browserjs.dom.form.Input' ),
	
	_class('SubmitButton')._extends('Input', {
		SubmitButton : function( label ){
			this._super('submit');
			if(label !== undefined){
				this.element().value = label;
			};
		}//,
	})
);
