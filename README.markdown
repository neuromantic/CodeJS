# Code.js

## Welcome to Web 3.0


 
 **Class / Object Development Evironment for Javascript**
 
  * Code.js is a dialect of javascript that will make it natural for AS3 programmers to transition into Web standards.
  * The project aims to be truly cross-browser under the hood, so users will only need to think about their creative goals.
  * Code.js is a compact js library that loads a module called Fase.js, a collection of classes familiar to Flash developers for creating and manipulating a DisplayList within the DOM.
  
## Why?

  * We want to put the art back into front end development, and allow creative coders to focus on more beautiful things than cross-browser development, or copying and pasting old XHTML, CSS, JS, etc.
  * Code( [ Fase, Site ], function () { provides HTML5 *without* hiccups.
  
## Want to Contribute?
  
  * Email `git@neuromantic.com` to be added to the git repo.
  * `git clone git@github.com:FaseJS/fasejs.git`.
  
## What's it like?

/*!
 *
 * Sprite.js
 * com.fasejs.display.Sprite
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

_class( 'Sprite' )._extends( 'DisplayObject', {
	_graphics : null,
	graphics : function () {//read only
		return this._graphics || ( this._graphics = new Graphics( this ) );
		init : function(name){
			this.name(name);
		}
	},
});
  * *[http://FaseJS.com/](http://FaseJS.com/)*
  * *[http://twitter.com/NeuromanticLLC/](http://twitter.com/NeuromanticLLC/)*
