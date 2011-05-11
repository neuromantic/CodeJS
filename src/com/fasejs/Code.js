/*!
 *
 * Code.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

(function(){
	console.log('code loaded.');
	window.Code = function(modules,application) {
		onCodeReady = application;
		_trace = function( seriously ) {
			var output = "";
			for( index in arguments ) {
				 output += arguments[ index ] + (' ');
			};
			console.log( output );
		};
		
		_null = function () {// null binding
			return null;
		};
		
		var _processed = [];
		var _complete = [];
		_import = function( url ) {
			if( ( _processed.indexOf( url ) < 0 )  ){
				_processed.push(url);
				var host = document.location.host;
				var script = 'src/' + url.replace( /\./g, '/' ) + '.js';
				_xhr = function() {
					var request = new XMLHttpRequest();
					request.open.apply(request, arguments);
					return request;
				};
				with(_xhr('GET', script, false)) {
					send(null);
					if (status == 200) {
						eval(responseText);
						_complete.push(url);
						processQueue();
					} else if (status == 0) {
						eval(responseText);
					} else {
						throw new Error(status);
					};
				};
			}else{
				_trace( url, 'already imported.' );
			};
		};
		batchImport = function( queue ){
	 		_queue = _queue.concat( queue );
	 		processQueue();
		 }
		_queue = [];
		 processQueue = function( queue ) {
		 	
			if ( _complete.length == _queue.length ) {
				return window.onCodeReady();
			}else{
				_import( _queue[ _complete.length] );
			}
		}
		
		_package = function( packageName, imports, classClosure ) {
			var branch = window;
			for ( branchName in Array( packageName ).explode( '.' ) ) {
				branch = branch[ branchName ] = branch[ branchName ] || {};
			}
			importList( imports, classClosure );
		}
	
		_class = function( className, properties ) {
		  	var newClass = Class._plus( properties );
		    newClass._extends = function( parentClassName, properties ) {
		       window[ className ] = window[ parentClassName ]._plus( properties );
		    	window[ className ]._className = className;
		    };
		    newClass._className = className
		    window[ className ] = newClass;
	 		
			return window[ className ];
		};
		
	// DON'T GET CUTE.
		window.Class = function (){};
		window.Class._plus = function( additions ) {
			var initializing = false;
			var _super = this.prototype;
			initializing = true;
			var prototype = new this();
			var privateProperties = {};
			initializing = false;
		 	for ( var name in additions ) {
			var	propertyKeyword = 'public';
			var propertyType = 'var';
			var propertyName = name;
		 		if ( name.indexOf( 'static_' ) === 0 ) {
					propertyKeyword = 'static'
					propertyName  = name.substring( name.indexOf( 'static_' ) + 'static_'.length , name.length );
				 	Class[ propertyName ] = typeof additions[ name ] == 'function' && typeof _super[ name ] == 'function' ? ( function( name, fn ) {
						propertyType = 'function';
				   		return function () {
				        	var tmp = this._super;
				            this._super = _super[ name ];
				           	var ret = fn.apply( this, arguments );
				           	this._super = tmp;
				           	return ret;
				       	};
				  	} )( name, additions[ name ] ) : clone( additions[ name ] );
		 		} else if ( name.indexOf( 'private_' ) === 0 ){
					propertyKeyword = 'private';
					propertyName = name.substring( name.indexOf( 'private_' ) + 'private_'.length , name.length );
			 		privateProperties[ propertyName ] = typeof additions[ name ] == 'function' && typeof _super[ name ] == 'function' ? ( function( name, fn ) {
						propertyType = 'function';
				   		return function () {
				        	var tmp = this._super;
				            this._super = _super[ name ];
				           	var ret = fn.apply( this, arguments );
				           	this._super = tmp;
				           	return ret;
				       	};
				  	} )( name, additions[ name ]) : clone( additions[ name ] );
		 		} else {
				  	prototype[ propertyName ] = typeof additions[ name ] == 'function' && typeof _super[name] == 'function' ? ( function( name, fn ) {
						propertyType = 'function';
				   		return function() {
				        	var tmp = this._super;
				            this._super = _super[name];
				           	var ret = fn.apply(this, arguments);
				           	this._super = tmp;
				           	return ret;
				       	};
				  	} )( name, additions[ name ] ) : clone( additions[ name ] );
			  	};
			};
			function Class() {
		  		if (! initializing && this.init ) {
			   		this.init.apply( this, arguments );
			   		if(this.element){
			   			this.element().className = this.constructor._className;
			   		}
			   	};
			   	this._ = {};
			   	for ( propertyName in privateProperties ){
			   		this._[ propertyName ] = privateProperties[ propertyName ];
			   	};
			};
			Class.prototype = prototype;
		 	Class.constructor = Class;
		  	Class._plus = arguments.callee;
	
		  	return Class;
		  	
			function clone( original )
			{
			    if( ( typeof original != 'object' &&  !( original instanceof Array ) ) || original == null  ){
			        return original;
			    };
			    var copy =  original instanceof Array ? [] : new original.constructor();
			    for( var property in original ){
			        copy[property] = clone(original[property]);
			    };
			    return copy;
			};
		};
		
		for(index in modules){
			_queue = _queue.concat( modules[ index ]() );
			processQueue()
		};
	};
})();

