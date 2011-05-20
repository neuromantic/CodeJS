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
_package( 'com.browserjs.dom.form',

	_import( 'com.fasejs.text.TextField' ),
	_import( 'com.browserjs.dom.form.Input' ),
	
	_class('TextArea')._extends('Input', {
		TextArea : function( placeholderText ){
			this.element( document.createElement( 'textarea' ) );
			if(placeholderText){
				this.element().setAttribute( 'placeholder', placeholderText );
			}
		}
	}
));
