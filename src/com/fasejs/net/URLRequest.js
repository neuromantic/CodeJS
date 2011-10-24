 /*!
 * URLRequest.js
 * com.fasejs.net.URLRequest
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.fasejs.net',
	 
 	_import( 'com.fasejs.events.EventDispatcher' ),
 	
	_class( 'URLRequest', {
	   data : null,
	   method : 'GET',
	   url : '',
	   URLRequest : function ( url, method, data ) {
		   this.data = data;
		   this.method = method;
		   this.url = url; 	
	   },
	   toString : function () {
			return 'from ' +  this.url + ' using ' + this.method;
	   }//,	    
	})
);