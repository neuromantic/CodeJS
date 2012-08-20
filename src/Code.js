/*!
 *
 * Code.js
 * 
 * Class / Object Descripion Engine for Javascript
 * 
 * https://github.com/neuromantic/CodeJS
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */

( function ( ) {
	var fs;
	global = ( typeof window == 'object') ? window : ( typeof global == 'object') ? global : { dev: null }; 
	if ( typeof require == 'function' ) {
		fs = require( 'fs' );
	}
	var _ = {
		debugging : true,
		util : {
			deepCopy : deepCopy,
			scope : function ( fn, scope, functionName ) {
				return function () {
					var s = '';
					for (var i = 0; i < arguments.length; i++) {
						s+=arguments[i]+","
					}
// _debug( 'calling scoped', functionName, scope, s );
					 return fn.apply( scope, arguments );
				}
			},
			isMethod : function( property ) {
				return ( ( typeof property == 'function' ) && ( ! ( property instanceof RegExp ) ) );
			}
		},// util
		loading : {
			queue : [],
			_import : function( classPath, immediately ) {
				if( _.loading.queue.indexOf( classPath ) < 0 ) {
_debug( 'importing', classPath );
					_.loading.load( classPath );// push path into loading queue
					
				}// if
			},// _import
			_class : function ( className ) {
_debug( 'creating stub class for', className );
				var stub = { 
					_extends : function( superName ) {
						this._super = superName;//set super name for definition tree
					}// _extends
				};// return object
				global[ className ] = stub;
				return global[ className ];
			},// _class ( temp )
			load : function( classPath, first ) {
_debug( 'loading', classPath );
				var scriptPath = classPath.replace( /\./g, '/' ) + '.js';
				try{
					this.queue.push( classPath);
					if( fs ){//server
_debug( 'from local file system' );
						try{
_debug( 'file:', scriptPath );
							var response = fs.readFileSync( scriptPath, 'ascii' );
						}catch(error){
_debug( 'file system error');
							throw(error);
						}
					} else {//client // ( typeof XMLHttpRequest == "function" )
_debug( 'from remote location' );
						var scriptURL = 'src/' + scriptPath;
						var request = new XMLHttpRequest();
						request.open( 'GET', scriptURL, false );
						request.send( null );
						if ( request.status == 200 ) {
							var response = request.responseText
						} else if ( request.status == 0 ) {
							// eval( responseText );
						} else {// else if
							throw new Error( request.status );
						};// else
					}  
				}catch( error ){
_debug( 'error loading', classPath, 'Error Status:', error.message);
					throw error;
				}
//_debug( '>>> loaded', classPath, '. processing imports' );
				_import = _.loading._import;//load
				_class = _.loading._class;//stub
				try{
					eval( response );
				}catch( error ){
_debug( 'error completing imports for '+  classPath + '. Error Text:' + error.message );
					throw error;
				}
				var className = classPath.split( '.' ).pop();
				global[ className ]._script = response;//store script
				_.definition.queue.push(className );// add script to definition queue
//_debug( 'L[ ' + this.queue.map( function( o ){ return o.split( '.' ).pop() } ).sort().join(' ') );
//_debug( 'D[ ' + _.definition.queue.map( function( o ){ return o.split( '.' ).pop() } ).sort().join(' ') );
//_debug( '<<< finished loading tasks for', classPath)
				if( this.queue.length == _.definition.queue.length ){
					_.definition.defineClasses();
				}// if
			}//, load
		},// loading
		definition : {
			initializing : false,
			queue : [],
			_import : function( classPath, immediately ) {
			},// _import
			_class : function( className, properties ) {
_debug( '_class', className );
				if(! global[ className ]._constructor ) { // if class is stub
					var newClass = Class._plus( className, properties );// create the class from ClassObject
					newClass._extends = function( parentClassName, properties ) {
_debug( '_extends', parentClassName );
							global[ className ] = global[ parentClassName ]._plus( className, properties );
						 	global[ className ]._className = className;
					};// _extends
					global[ className ] = newClass;
				} 
				return global[ className ]
			 },// _class
			defineClasses : function () {
_debug( 'defining classes' );
				var className;
				while ( className = this.queue[ 0 ] ) {
					if (! global[ className ]._constructor ) {
						this.define( className );
					}// if
				}// while
				_.application();// app is good to go.
			},// defineClasses
			define : function ( className ) {
				_class = _.definition._class;// define
				_import = _.definition._import;// null
				var index = this.queue.indexOf( className );
				if( index >= 0 ) {
					var classObject = global [ className ];
					this.queue.splice( index, 1);
_debug( 'defining class', className );
					if ( classObject._super ){
_debug( 'defining superclass', classObject._super );
						this.define(classObject._super);
					}// if
//_debug( 'evaluating script', classObject._script );
					try{
						eval( classObject._script );
					}catch( error ){
_debug( 'error defining', className, 'Error Text:', error.message )
						throw error;
					}
_debug( this.queue.length, 'definitions remain.' );
				}// if
			}//define
		}// definition
	};// _
	console = console || {};
	console.log = console.log || function () {};
			
	_null = function () {// null binding reserved for future use
		return null;
	};// _null
	
	_trace = function () {
		var output = "";
		var args = arguments;
		for( index in args ) {
			var token = args[ index ];
			output += token + (' ');
		};// for
		console.log( output );
	};// _trace
	
	_debug = function () {
		if( _.debugging ) _trace.apply( this, arguments );
	};// ////_debug
	
	_package = function() { // Future Use
// _trace( 'package', arguments[ 0 ] );
	};// _package
	
	_import = _.loading._import;
	
	// DON'T GET CUTE.
		
	/* 
	 * 
	 * Class is a modification of
	 * 'Class' originally by the immortal John Resig
	 * thanks For Sure, Rad!
	 * 
	 * http://bit.ly/4U5H
	 *	
	 */	
	  // var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	  // The base Class implementation -- 
	  // provides _get and _set shortcuts to eliminate abiguous assignment ( is it a  property or a getSetter ? )
	  // provides .add() to replace += 
	  var Class = function(){};
	  Class._className = 'Class';
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
				value = value || 1;
				var property = this[ propertyName ];
				if (property  === undefined ) {
					this[propertyName] = value;
				}else{
					( typeof this[ propertyName ] == 'function' ) ? this[ propertyName ]( this[ propertyName ]() + value ) : this[ propertyName ] += value;
				};
			}
		};
		
	  // Create a new Class that inherits from this class
	Class._plus = function(className, additions) {
		var _super = this.prototype;
		
		// Instantiate a base class (but only create the instance,
		// don't run the _config constructor)
		_.definition.initializing = true;
		var newPrototype = new this();
		newPrototype._className = className;
		newPrototype.toString = function () { return '[Code '+this._className+']'; } 
		_.definition.initializing = false;
		
		// The dummy class constructor
		function ClassObject() {
		  // All construction is actually done in the _config method (declared using the new Class name as string (className ) )
		  this._ = _.util.deepCopy( this._ );
		  this.__ = _.util.deepCopy( this.__ );
		  
			if ( !_.definition.initializing ){
				if ( this._className.indexOf( 'Event' ) < 0 && [ 'Dictionary' ].indexOf( this._className ) < 0 ) {
					//_debug( 'new', this._className );
				};
				for ( var propertyName in this ){
					var property = this[ propertyName ];
					if ( _.util.isMethod( property ) && [ 'toString', '_get','_set', '_add' ].indexOf( propertyName) < 0 ){
						this[ propertyName ] = _.util.scope( property, this, propertyName );
					};//if
				};//for
				
				for ( var propertyName in this._ ){
					var property = this._[ propertyName ];
					if ( _.util.isMethod( property ) ){
						this._[ propertyName ] = _.util.scope( property, this );
					}//if
				}//for
			  	if( this._config ) {
			 		this._config.apply( this, arguments );
			  	};
			}
		}
		
		newPrototype._ = _super._ ? _.util.deepCopy( _super._ ) : {}; // private space
		newPrototype.__ = _super.__ ? _.util.deepCopy( _super.__ ) : { getters : {}, setters: {}, getSetterNames:[] }; // getters/setters space
		
		// TODO: getter/setters proper

		for (var name in additions) {
			var addition = additions[ name ];
			var	propertyKeyword;
			var	propertyType;
			var propertyName = name;
			var propertyDefault = '[function]';
			var attachTarget = {};
			
		// TODO: getter/setters proper
		
			if ( name.indexOf( 'private_' ) >= 0 ) {
				propertyKeyword = 'private';
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				attachTarget = newPrototype._;
			} else if ( name.indexOf( 'static_' ) >= 0 ) {
				propertyKeyword = 'static';
				attachTarget = ClassObject;
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
			}  else if ( name.indexOf( 'get_' ) >= 0 ) {
				propertyKeyword = 'get';
				attachTarget = newPrototype.__.getters;
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				if( newPrototype.__.getSetterNames.indexOf( propertyName ) == -1 ){
					newPrototype.__.getSetterNames.push( propertyName );
				}
			}  else if ( name.indexOf( 'set_' ) >= 0 ) {
				propertyKeyword = 'set';
				attachTarget = newPrototype.__.setters;
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				if( newPrototype.__.getSetterNames.indexOf( propertyName ) == -1 ){
					newPrototype.__.getSetterNames.push( propertyName );
				}
			} else if ( name === className ){
				propertyKeyword = 'constructor';
				attachTarget = newPrototype;
				propertyName = '_config'
			} else {
				propertyKeyword = 'public';
				attachTarget = newPrototype;
			};
			
		  // Check if we're overwriting an existing function
			var property;
			if ( typeof addition == 'function'  ){//&& fnTest.test(addition)
		      	propertyType = 'function'
		      	property = ( typeof _super[propertyName] == 'function' ) ? 
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
		            var ret = fn.apply( this, arguments );        
		            this._super = tmp;
		            
		            return ret;
		          };
		        })( propertyName, addition ) : addition;
			}else{
				propertyType = 'var';
				propertyDefault = addition;
		    	property = _.util.deepCopy( addition );
		    }
		    
			attachTarget[ propertyName ] = property;
//_debug('\t', propertyKeyword, propertyType, propertyName, propertyDefault );
		}
		
		// Create getter / setter properties
		for ( var index in newPrototype.__.getSetterNames ){
			var getSetterName = newPrototype.__.getSetterNames[ index ];
//_debug( 'property name:', getSetterName);			
			var getter = newPrototype.__.getters[getSetterName ];
//_debug( 'getter function:', getter) ;		
			var setter = newPrototype.__.setters[getSetterName ];
//_debug( 'setter function:', setter );		
			newPrototype[ getSetterName ] = (function( getter, setter, getSetterName ){
				return function ( value ) {
					if( value === undefined ) {
						if( getter ) {
	//_debug( 'getting', getSetterName, 'of', this, ':', getter());
							return getter.call( this );
						}else return;
					}
					if( setter ){
	// _debug( 'setting', getSetterName, 'of', this, 'to', value);
						setter.call( this, value );
					}
				}
			})( getter, setter, getSetterName);
		};

		// Populate our constructed prototype object
		ClassObject.prototype = newPrototype;
		
		// Enforce the constructor to be what we expect
		ClassObject.constructor = ClassObject;
		
		// And make this class extendable
		ClassObject._plus = arguments.callee;
		
		return ClassObject;
	};
			
			
	function Code ( applicationClassPath ) {
//_debug( 'starting Code with application', applicationClassPath );
		var applicationClassName = applicationClassPath.split( '.' ).pop();
		_.application = ( function( applicationClassName ) {
			return function () {
//_debug( 'starting', applicationClassName )
			 	_.application = new global[ applicationClassName ]();
			}// return function
		} )( applicationClassName );//closure
		_import( applicationClassPath );
	}
	Code._ = _;
	global.Code = Code;
//_debug('Code ready.')

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Goin' Deep /////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

	//	DEEP COPY props http://oranlooney.com/deep-copy-javascript/
	/* This section is part of OWL JavaScript Utilities.

	OWL JavaScript Utilities is free software: you can redistribute it and/or 
	modify it under the terms of the GNU Lesser General Public License
	as published by the Free Software Foundation, either version 3 of
	the License, or (at your option) any later version.
	
	OWL JavaScript Utilities is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Lesser General Public License for more details.
	
	To receive a copy of the GNU Lesser General Public License, see: 
	<http://www.gnu.org/licenses/>.
	*/
		// the re-usable constructor function used by clone().
	function Clone() {};

	// clone objects, skip other types.
	function clone(target) {
		if ( typeof target == 'object' ) {
			Clone.prototype = target;
			return new Clone();
		} else {
			return target;
		}
	}


	// Shallow Copy 
	function copy(target) {
		if (typeof target !== 'object' ) {
			return target;  // non-object have value sematics, so target is already a copy.
		} else {
			var value = target.valueOf();
			if (target != value) { 
				// the object is a standard object wrapper for a native type, say String.
				// we can make a copy by instantiating a new object around the value.
				return new target.constructor(value);
			} else {
				// ok, we have a normal object. If possible, we'll clone the original's prototype 
				// (not the original) to get an empty object with the same prototype chain as
				// the original.  If just copy the instance properties.  Otherwise, we have to 
				// copy the whole thing, property-by-property.
				if ( target instanceof target.constructor && target.constructor !== Object ) { 
					var c = clone(target.constructor.prototype);
				
					// give the copy all the instance properties of target.  It has the same
					// prototype as target, so inherited properties are already there.
					for ( var property in target) { 
						if (target.hasOwnProperty(property)) {
							c[property] = target[property];
						} 
					}
				} else {
					var c = {};
					for ( var property in target ) c[property] = target[property];
				}
				
				return c;
			}
		}
	}

	// Deep Copy
	var deepCopiers = [];

	function DeepCopier(config) {
		for ( var key in config ) this[key] = config[key];
	}
	DeepCopier.prototype = {
		constructor: DeepCopier,

		// determines if this DeepCopier can handle the given object.
		canCopy: function(source) { return false; },

		// starts the deep copying process by creating the copy object.  You
		// can initialize any properties you want, but you can't call recursively
		// into the DeeopCopyAlgorithm.
		create: function(source) { },

		// Completes the deep copy of the source object by populating any properties
		// that need to be recursively deep copied.  You can do this by using the
		// provided deepCopyAlgorithm instance's deepCopy() method.  This will handle
		// cyclic references for objects already deepCopied, including the source object
		// itself.  The "result" passed in is the object returned from create().
		populate: function(deepCopyAlgorithm, source, result) {}
	};

	function DeepCopyAlgorithm() {
		// copiedObjects keeps track of objects already copied by this
		// deepCopy operation, so we can correctly handle cyclic references.
		this.copiedObjects = [];
		thisPass = this;
		this.recursiveDeepCopy = function(source) {
			return thisPass.deepCopy(source);
		}
		this.depth = 0;
	}
	DeepCopyAlgorithm.prototype = {
		constructor: DeepCopyAlgorithm,

		maxDepth: 256,
			
		// add an object to the cache.  No attempt is made to filter duplicates;
		// we always check getCachedResult() before calling it.
		cacheResult: function(source, result) {
			this.copiedObjects.push([source, result]);
		},

		// Returns the cached copy of a given object, or undefined if it's an
		// object we haven't seen before.
		getCachedResult: function(source) {
			var copiedObjects = this.copiedObjects;
			var length = copiedObjects.length;
			for ( var i=0; i<length; i++ ) {
				if ( copiedObjects[i][0] === source ) {
					return copiedObjects[i][1];
				}
			}
			return undefined;
		},
		
		// deepCopy handles the simple cases itself: non-objects and object's we've seen before.
		// For complex cases, it first identifies an appropriate DeepCopier, then calls
		// applyDeepCopier() to delegate the details of copying the object to that DeepCopier.
		deepCopy: function(source) {
			// null is a special case: it's the only value of type 'object' without properties.
			if ( source === null ) return null;

			// All non-objects use value semantics and don't need explict copying.
			if ( typeof source !== 'object' ) return source;

			var cachedResult = this.getCachedResult(source);

			// we've already seen this object during this deep copy operation
			// so can immediately return the result.  This preserves the cyclic
			// reference structure and protects us from infinite recursion.
			if ( cachedResult ) return cachedResult;

			// objects may need special handling depending on their class.  There is
			// a class of handlers call "DeepCopiers"  that know how to copy certain
			// objects.  There is also a final, generic deep copier that can handle any object.
			for ( var i=0; i<deepCopiers.length; i++ ) {
				var deepCopier = deepCopiers[i];
				if ( deepCopier.canCopy(source) ) {
					return this.applyDeepCopier(deepCopier, source);
				}
			}
			// the generic copier can handle anything, so we should never reach this line.
			throw new Error("no DeepCopier is able to copy " + source);
		},

		// once we've identified which DeepCopier to use, we need to call it in a very
		// particular order: create, cache, populate.  This is the key to detecting cycles.
		// We also keep track of recursion depth when calling the potentially recursive
		// populate(): this is a fail-fast to prevent an infinite loop from consuming all
		// available memory and crashing or slowing down the browser.
		applyDeepCopier: function(deepCopier, source) {
			// Start by creating a stub object that represents the copy.
			var result = deepCopier.create(source);

			// we now know the deep copy of source should always be result, so if we encounter
			// source again during this deep copy we can immediately use result instead of
			// descending into it recursively.  
			this.cacheResult(source, result);

			// only DeepCopier::populate() can recursively deep copy.  So, to keep track
			// of recursion depth, we increment this shared counter before calling it,
			// and decrement it afterwards.
			this.depth++;
			if ( this.depth > this.maxDepth ) {
				throw new Error("Exceeded max recursion depth in deep copy.");
			}

			// It's now safe to let the deepCopier recursively deep copy its properties.
			deepCopier.populate(this.recursiveDeepCopy, source, result);

			this.depth--;

			return result;
		}
	};

	// entry point for deep copy.
	//   source is the object to be deep copied.
	//   maxDepth is an optional recursion limit. Defaults to 256.
	function deepCopy(source, maxDepth) {
		var deepCopyAlgorithm = new DeepCopyAlgorithm();
		if ( maxDepth ) deepCopyAlgorithm.maxDepth = maxDepth;
		return deepCopyAlgorithm.deepCopy(source);
	}

	// publicly expose the DeepCopier class.
	deepCopy.DeepCopier = DeepCopier;

	// publicly expose the list of deepCopiers.
	deepCopy.deepCopiers = deepCopiers;

	// make deepCopy() extensible by allowing others to 
	// register their own custom DeepCopiers.
	deepCopy.register = function(deepCopier) {
		if ( !(deepCopier instanceof DeepCopier) ) {
			deepCopier = new DeepCopier(deepCopier);
		}
		deepCopiers.unshift(deepCopier);
	}

	// Generic Object copier
	// the ultimate fallback DeepCopier, which tries to handle the generic case.  This
	// should work for base Objects and many user-defined classes.
	deepCopy.register({
		canCopy: function(source) { return true; },

		create: function(source) {
			if ( source instanceof source.constructor ) {
				return clone(source.constructor.prototype);
			} else {
				return {};
			}
		},

		populate: function(deepCopy, source, result) {
			for ( var key in source ) {
				if ( source.hasOwnProperty(key) ) {
					result[key] = deepCopy(source[key]);
				}
			}
			return result;
		}
	});

	// Array copier
	deepCopy.register({
		canCopy: function(source) {
			return ( source instanceof Array );
		},

		create: function(source) {
			return new source.constructor();
		},

		populate: function(deepCopy, source, result) {
			for ( var i=0; i<source.length; i++) {
				result.push( deepCopy(source[i]) );
			}
			return result;
		}
	});

	// Date copier
	deepCopy.register({
		canCopy: function(source) {
			return ( source instanceof Date );
		},

		create: function(source) {
			return new Date(source);
		}
	});

	// HTML DOM Node

	// utility function to detect Nodes.  In particular, we're looking
	// for the cloneNode method.  The global document is also defined to
	// be a Node, but is a special case in many ways.
	function isNode(source) {
		if ( global.Node ) {
			return source instanceof Node;
		} else {
			// the document is a special Node and doesn't have many of
			// the common properties so we use an identity check instead.
			if ( typeof document == 'object' && source === document ) return true;
			return (
				typeof source.nodeType === 'number' &&
				source.attributes &&
				source.childNodes &&
				source.cloneNode
			);
		}
	}

	// Node copier
	deepCopy.register({
		canCopy: function(source) { return isNode(source); },

		create: function(source) {
			// there can only be one (document).
			if (typeof document == 'object' && source === document ) return document;

			// start with a shallow copy.  We'll handle the deep copy of
			// its children ourselves.
			return source.cloneNode(false);
		},

		populate: function(deepCopy, source, result) {
			// we're not copying the global document, so don't have to populate it either.
			if ( typeof document == 'object' && source === document ) return document;

			// if this Node has children, deep copy them one-by-one.
			if ( source.childNodes && source.childNodes.length ) {
				for ( var i=0; i<source.childNodes.length; i++ ) {
					var childCopy = deepCopy(source.childNodes[i]);
					result.appendChild(childCopy);
				}
			}
		}
	});

	deepCopy.register( {//Fase Dictionary
		canCopy: function(source) { return source._className == 'Dictionary'; },
		create: function(source) {
			return new Dictionary();
		},
		populate: function(deepCopy, source, result) {
			for ( var i in source._keys ){
				result._keys[ i ] = source._keys[ i ];
				result._values[ i ] = deepCopy( source.values[ i ])
			};
		}
	});

return Code;
})();