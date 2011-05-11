/*!
 *
 * Section.js
 * com.browserjs.dom.Section
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_class('Section')._extends('TextField', {
	init : function( element ){
		element = element || this.element(document.createElement('section'));
	}
});
