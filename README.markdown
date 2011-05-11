# Code.js

## Welcome to Web 3.0
 
 **Class / Object Development Evironment for Javascript**
 
  * Code.js is a dialect of javascript that will make it natural for AS3 programmers to transition into Web standards.
  * The project aims to be truly cross-browser under the hood, so users will only need to think about their creative goals.
  * Code.js is a compact js library that loads a module called Fase.js, a collection of classes familiar to Flash developers for creating and manipulating a DisplayList within the DOM.
  
## Why?

  * We want to put the art back into front end development, and allow creative coders to focus on more beautiful things than cross-browser development, or copying and pasting old XHTML, CSS, JS, etc.
  * Code.js running the Fase.js and Site.js modules provide HTML5 *without* hiccups.
  
## Want to Contribute?
  
  * Email `git@neuromantic.com` to be added to the git repo.
  * `git clone git@github.com:FaseJS/fasejs.git`.
  
## What's it like?

    (function() {
    
    	_import('com.fasejs.text.TextField');
    	_import('com.fasejs.text.TextFormat');
    	_import('com.fasejs.net.URLLoader');
    
    	window.onFaseReady = function() {
    
    		// logo
    		var logoField = new TextField();
    		logoField.addChild('logo');
    		logoField.text('Fase.js');
    		logoField.x(30);
    		logoField.y(30);
    		var h1Format = new TextFormat();
    		h1Format.font('"Helvetica Neue", Helvetica, Tahoma');
    		h1Format.fontSize(72);
    		h1Format.letterSpacing(-1);
    		h1Format.color('#000');
    		h1Format.textShadow('#fff');
    		h1Format.fontWeight('bold');
    		logoField.setTextFormat(h1Format);
    		
    		var SFWeather = new URLLoader();
    		SFWeather.URLRequest = 'http://www.google.com/ig/api?weather=San+Francisco';
    		SFWeather.load();
    		
    	};
    	
    })();
  
  * *[http://FaseJS.com/](http://FaseJS.com/)*
  * *[http://twitter.com/NeuromanticLLC/](http://twitter.com/NeuromanticLLC/)*
