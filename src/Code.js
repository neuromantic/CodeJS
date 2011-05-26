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

	_ = {};//                                             * Reserving global._ *
	
	_.util = {};
	
//	DEEP COPY props http://oranlooney.com/deep-copy-javascript/

	function Clone() {};
	function clone(target) {
		if ( typeof target == 'object' ) {
			Clone.prototype = target;
			return new Clone();
		} else {
			return target;
		};
	};
	function copy(target) {
		if (typeof target !== 'object' ) {
			return target;
		} else {
			var value = target.valueOf();
			if (target != value) { 
				return new target.constructor(value);
			} else {
				if ( target instanceof target.constructor && target.constructor !== Object ) { 
					var c = clone(target.constructor.prototype);
					for ( var property in target) { 
						if (target.hasOwnProperty(property)) {
							c[property] = target[property];
						};
					};
				} else {
					var c = {};
					for ( var property in target ) c[property] = target[property];
				};			
				return c;
			};
		};
	};
	var deepCopiers = [];
	function DeepCopier(config) {
		for ( var key in config ) this[key] = config[key];
	};
	DeepCopier.prototype = {
		constructor: DeepCopier,
		canCopy: function(source) { return false; },
		create: function(source) { },
		populate: function(deepCopyAlgorithm, source, result) {}
	};
	function DeepCopyAlgorithm() {
		this.copiedObjects = [];
		thisPass = this;
		this.recursiveDeepCopy = function(source) {
			return thisPass.deepCopy(source);
		};
		this.depth = 0;
	 };
	DeepCopyAlgorithm.prototype = { 
		constructor : DeepCopyAlgorithm,
		maxDepth : 256,			
		cacheResult : function(source, result) {
			this.copiedObjects.push([source, result]);
		},
		getCachedResult : function(source) {
			var copiedObjects = this.copiedObjects;
			var length = copiedObjects.length;
			for ( var i=0; i<length; i++ ) {
				if ( copiedObjects[i][0] === source ) {
					return copiedObjects[i][1];
				};
			};
			return undefined;
		},
		deepCopy : function(source) {
			if ( source === null ) return null;
			if ( typeof source !== 'object' ) return source;
			var cachedResult = this.getCachedResult(source);
			if ( cachedResult ) return cachedResult;
			for ( var i=0; i<deepCopiers.length; i++ ) {
				var deepCopier = deepCopiers[i];
				if ( deepCopier.canCopy(source) ) {
					return this.applyDeepCopier(deepCopier, source);
				};
			};
			throw new Error("no DeepCopier is able to copy " + source);
		},
		applyDeepCopier : function( deepCopier, source) {
			var result = deepCopier.create(source);
			this.cacheResult(source, result);
			this.depth++;
			if ( this.depth > this.maxDepth ) {
				throw new Error("Exceeded max recursion depth in deep copy.");
			};
			deepCopier.populate(this.recursiveDeepCopy, source, result);
			this.depth--;
			return result;
		}
	};
	
	var deepCopy = function(source, maxDepth) {
		var deepCopyAlgorithm = new DeepCopyAlgorithm();
		if ( maxDepth ) deepCopyAlgorithm.maxDepth = maxDepth;
		return deepCopyAlgorithm.deepCopy(source);
	};
	deepCopy.DeepCopier = DeepCopier;
	deepCopy.deepCopiers = deepCopiers;
	deepCopy.register = function(deepCopier) {
		if ( !(deepCopier instanceof DeepCopier) ) {
			deepCopier = new DeepCopier(deepCopier);
		};
		deepCopiers.unshift(deepCopier);
	};
	deepCopy.register({// generic
		canCopy: function(source) { return true; },
		create: function(source) {
			if ( source instanceof source.constructor ) {
				return clone(source.constructor.prototype);
			} else {
				return {};
			};
		},
		populate: function(deepCopy, source, result) {
			for ( var key in source ) {
				if ( source.hasOwnProperty(key) ) {
					result[key] = deepCopy(source[key]);
				};
			};
			return result;
		}
	});
	deepCopy.register({// array
		canCopy: function(source) {
			return ( source instanceof Array );
		},
		create: function(source) {
			return [];
		},
		populate: function(deepCopy, source, result) {
			for ( var i=0; i<source.length; i++) {
				result.push( deepCopy(source[i]) );
			};
			return result;
		}
	});
	deepCopy.register({//date
		canCopy: function(source) {
			return ( source instanceof Date );
		},
		create: function(source) {
			return new Date(source);
		}
	});
	function isNode(source) {
		if ( window.Node ) {
			return source instanceof Node;
		} else {
			if ( source === document ) return true;
			return (
				typeof source.nodeType === 'number' &&
				source.attributes &&
				source.childNodes &&
				source.cloneNode
			);
		};
	}
	deepCopy.register({//dom elements
		canCopy: function(source) { return isNode(source); },
		create: function(source) {
			if ( source === document ) return document;
			return source.cloneNode(false);
		},
		populate: function(deepCopy, source, result) {
			if ( source === document ) return document;
			if ( source.childNodes && source.childNodes.length ) {
				for ( var i=0; i<source.childNodes.length; i++ ) {
					var childCopy = deepCopy(source.childNodes[i]);
					result.appendChild(childCopy);
				};
			};
		}
	});
	
	
	_.util.deepCopy = deepCopy;
		
		
		
	// CODE
	
	
	console.log('code.');

	window.CodeBase = false;
			
	_null = function () {// null binding reserved for future use
		return null;
	};
	_trace = function( ) {
		var output = "";
		for( index in arguments ) {
			 output += arguments[ index ] + (' ');
		};
		console.log( output );
	};
	
	_.loading = {};
	_.loading.processed = [];
	_.loading.complete = [];
	_.loading.queue = [];
	_import = function( url ) {
		window[ url.substr(url.lastIndexOf('.')+1, url.length-1) ] = new Class(); // stub
		if( _.loading.queue.indexOf( url ) < 0 && _.loading.processed.indexOf( url ) < 0 ) {
			_.loading.queue.push( url );
 			_.loading.processQueue();
		}else{
			_trace( 'been there, done that.' );
		}
 	
	}
	_.loading.process = function( url ) { 
		if( ( _.loading.processed.indexOf( url ) < 0 )  ){
_trace('loading',url );
			_.loading.processed.push(url);
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
					// var _class_ = _class;
					// _class = function(){
						// return new Class();
					// };
					eval(responseText);
					// _.definition.classFiles.push( responseText );
					// _class = _class_
					_.loading.complete.push(url);
					_.loading.processQueue();
				} else if (status == 0) {
					eval(responseText);
				} else {
					throw new Error(status);
				};
			};
		}else{
			_trace( url, 'already processed.' );
		};
	};
	 
	_.loading.processQueue = function () {
		if ( _.loading.complete.length == _.loading.queue.length ) {
			_trace( 'loaded', _.loading.complete.length,'classes.' );
			return window.onCodeReady();
		}else{
			var current =  _.loading.queue[ _.loading.complete.length];
			if(_.loading.processed.indexOf( current ) < 0 ){
				_.loading.process( _.loading.queue[ _.loading.complete.length ] );
			}
		};
	};
	
	_package = function( ) { // Future Use
		_trace( '_package ', arguments[ 0 ] )
	}
	
	_.definition = {};
	_.definition.queue = [];
	_.definition.classFiles = [];
	_class = function( codeName, properties ) {
		var newClass =  ( CodeBase ? CodeBase._plus( codeName, properties ) : Class._plus( codeName, properties ) );
	    newClass._extends = function( parentCodeName, properties ) {
	    	window[ codeName ] = window[ parentCodeName ]._plus( codeName, properties );
	    	window[ codeName ]._codeName = codeName;
	    };
	    window[ codeName ] = newClass;
		return window[ codeName ];
	};
	_.definition.processDefinitions = function () {
		var _package_ = _package;
		_package = function () {};
		var _import_ = _import;
		_import = function () {};
		while(_.definition.queue.length > 0){
			eval( _.definition.classFiles.pop() )
		}
		_import = _import_;
		_package = _package_;
	}

	
// DON'T GET CUTE.
Code = function(modules,application) {
	
/* 
 * 
 * Class via John Resig thanks For Sure, Rad!
 * 
 * http://bit.ly/4U5H
 *	
 */	

  var _configializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;;
  // The base Class implementation -- provides _get and _set shortcuts to eliminate abiguous assignment ( is it a  property or a getSetter ? )
  this.Class = function(){};
  Class._codeName = 'Class';
  Class.prototype = {
		_get : function( propertyName ){
			var property = this[ propertyName ];
			if (property  === undefined ) {
				return undefined;
			};
			return ( typeof this[ propertyName ] == 'function' ) ? this[ propertyName ]() : this[ propertyName ];
		},
		_set : function( propertyName, value ){
			var property = this[ propertyName ];
			if (property  === undefined ) {
				this[propertyName] = value;
			}else{
				( typeof this[ propertyName ] == 'function' ) ? this[ propertyName ]( value ) : this[ propertyName ] = value;
			};
		
		},
		_add : function( value, propertyName ){
			var property = this[ propertyName ];
			if (property  === undefined ) {
				this[propertyName] += value;
			}else{
				( typeof this[ propertyName ] == 'function' ) ? this[ propertyName ]( this[ propertyName ]() + value ) : this[ propertyName ] += value;
			};
		}
	};
	
  // Create a new Class that inherits from this class
  Class._plus = function(codeName, additions) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the _config constructor)
    _configializing = true;
    var newPrototype = new this();
    newPrototype._codeName = codeName;
    _configializing = false;
    
    // The dummy class constructor
    function Code() {
      // All construction is actually done in the _config method (declared using the new Class name as string (codeName ) )
      this._ = _.util.deepCopy( this._ );
      if ( !_configializing && this._config ) {
     	this._config.apply(this, arguments);
       }
    }
    
    newPrototype._ = _super._ || {};
    newPrototype.__ = _super.__ || {};
    
    newPrototype.__.getters = newPrototype.__.getters || {};
    newPrototype.__.setters = newPrototype.__.setters || {};
    
    var getSetters = [];
    // Copy the properties over onto the new prototype
    for (var name in additions) {
    	var addition = additions[ name ];
    	var	propertyKeyword;
		var propertyName = name;
 		var attachTarget = {};
 		if ( name.indexOf( 'get_' ) >= 0 ) {
 			propertyKeyword = 'get';
			propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
			attachTarget = newPrototype.__.getters;
			if ( getSetters.indexOf(propertyName) < 0 ){
				getSetters.push( propertyName );
			}
		}
 		if ( name.indexOf( 'set_' ) >= 0 ) {
 			propertyKeyword = 'set';
			propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
			attachTarget = newPrototype.__.setters;
			if ( getSetters.indexOf(propertyName) < 0 ){
				getSetters.push( propertyName );
			}
 		}
 		if ( name.indexOf( 'private_' ) >= 0 ) {
			propertyKeyword = 'private';
			propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
			attachTarget = newPrototype._;
		} else if ( name.indexOf( 'static_' ) >= 0 ) {
			propertyKeyword = 'static';
			attachTarget = Code;
			propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
		} else if ( name === codeName ){
			attachTarget = newPrototype;
			propertyName = '_config'
		} else {
			propertyKeyword = 'public';
			attachTarget = newPrototype;
		};
    	
      // Check if we're overwriting an existing function
      var property = ( typeof addition == "function" && typeof _super[propertyName] == "function" && fnTest.test(addition) ) ?
        (function(propertyName, fn){
          return function() {
            var tmp = this._super;
            
            // Allow this._super() to call superconstructor, and allow this._super.*() to call the super method
            if( propertyName === '_config' ) {
            	this._super = _super._config;
            }else{
            	this._super = _super;
            }
            
            
            // The _config method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })( propertyName, addition ) : addition;
        
    	attachTarget[ propertyName ] = property;
    }
    for ( var index in getSetters ) {
    	var getSetterName = getSetters[index];
    	newPrototype[ getSetterName ] = function ( value ) {
    		_trace("?",arguments.callee);
    		if ( value === undefined ) {
    			if ( this.__.getters[ arguments.callee.name ] ) {
    				return this.__.getters[ arguments.callee.name ].call( this );
    			}
    		}
    		if ( this.__.setters[ arguments.callee.name ] ) {
    			this.__.setters[ arguments.callee.name ].apply( this, value );
    		}
    	}
    }
    // Populate our constructed prototype object
    Code.prototype = newPrototype;
    
    // Enforce the constructor to be what we expect
    Code.constructor = Code;

    // And make this class extendable
    Code._plus = arguments.callee;
    
    return Code;
  };
  
//		Code _configializer
		

		_trace( 'running code.js', 'with '+( modules ? modules.length : "0" ), 'modules.' );
		onCodeReady = application || function () { _trace( 'no application provided'); } ;
		// _config to win it.
		_class('CodeBase')._extends('Class');
		// load modules
		if( modules.length === 0) {
			return onCodeReady();
		}
		for(index in modules){
			_.loading.queue = _.loading.queue.concat( modules[ index ]() );
			_.loading.processQueue()
		};
	}
})();