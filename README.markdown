# Fase.js

## This is *really* cool
 
 **Fast ActionScript Emulation for JavaScript**
 
  * FaseJS seeks to create a dialect of javascript that will make it natural for AS3 programmers to transition into Web standards.
  * The project aims to be truly cross-browser under the hood, so users will only need to think about their creative goals.
  * The end product will be a compact js library that contains the FaseJS core and a collection of classes familiar to Flash developers for creating and manuipulating a DisplayList within the DOM.
  
## Why?

  * We want to put the art back into front end developement, and be able to focus on harder things than cross-browser development, or copying and pasting old XHTML, CSS, JS, etc. We want, no we **need** HTML5 *without* the hiccups. If you can dream it, you can have it online before your next idea comes up.
  
## Want to Contribute?
  
  * Email `git@fasejs.com` to be added to the git repo.
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
  * *[http://twitter.com/FaseJS/](http://twitter.com/FaseJS/)*
