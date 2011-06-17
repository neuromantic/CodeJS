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

	_import( 'com.browserjs.dom.form.Input' ),
	
	_class('TextArea')._extends('TextInput', {
		TextArea : function( placeholder ){
			this._super();
			this.element( document.createElement( 'textarea' ) );
			if( placeholder ){
				this.placeholderText( placeholder );
			}
		}
	})
);
