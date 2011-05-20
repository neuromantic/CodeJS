/*!
 *
 * URLLoader.js
 * com.fasejs.net.URLLoader
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.net',
	 
 	_import( 'com.fasejs.events.EventDispatcher' ),
 	
	_class('URLLoader')._extends('EventDispatcher', {
	   URLRequestMethod : 'GET',
	   URLRequest : null,
	   URLVariables : null,
	   //  _
	   XMLHTTP : function () { // private const
	    	var x = false;
	    	if (window.XMLHttpRequest) {
	    		x = new XMLHttpRequest()
	      	} else if (window.ActiveXObject) {
	    		try {
	    			x = new ActiveXObject('Msxml2.XMLHTTP')
	    		} catch (e) { 
	    			try {
	           			x = new ActiveXObject('Microsoft.XMLHTTP')
	       			} catch (E) {
	            		x = false;
	          		};
	          	};
	        };
	    	return x;
	  	},
	    load : function() {
	    	//TODO: params = this.URLVariables;
	    	var _this = this;
	    	var XMLHTTP = this.XMLHTTP();
	    	if (XMLHTTP) {
	    		XMLHTTP.onreadystatechange = function stateChange() {
	    			if (XMLHTTP && XMLHTTP.readyState == 4) {
	    				if (XMLHTTP.status == 200) {
	    					var response = XMLHTTP.responseText;
	    					_this._dispatchEvent(new LoadingEvent(LoadingEvent.LOADED , response));
	    				};
	    			};
	    		};
	    		XMLHTTP.open('GET', this.URLRequest, true);
	    		XMLHTTP.send(null);
	    	};
	    }//,
	}//,
));

