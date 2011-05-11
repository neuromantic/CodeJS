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
 * Code.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
`(function() {
	window.onload = function () {
		Code( [ Fase, Browser ], function(){
			stage = new Stage( document.getElementById( 'stage' )) ;
			header = new TextField( 'Code.js' );
			stage.addChild( header );
			subhead = new TextField( 'Class / Object : Development Environment.' );
			stage.addChild( subhead );
			email = new EmailInput( 'enter your email' );
			stage.addChild( email );
			message = new TextArea( 'type your message' );
			stage.addChild( message );
			// header.addEventListener( MouseEvent.CLICK, function( event ){ _trace( '>', event.type ); } );
		});
	};
})();`
  * *[http://FaseJS.com/](http://FaseJS.com/)*
  * *[http://twitter.com/NeuromanticLLC/](http://twitter.com/NeuromanticLLC/)*
