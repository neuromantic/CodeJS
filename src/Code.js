/*!
 *
 * Code.js
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
(function () {
	_ = {// * Reserving global._ *
		codeDebug : false,
		util : {
			deepCopy : deepCopy,
			scope : function ( fn, scope, functionName ) {
				return function () {
// _debug( 'calling scoped', functionName, scope, fn );
					 return fn.apply( scope, arguments );
				}
			}
		},// util
		loading : {
			queue : [],
			_import : function( codePath, immediately ) {
				if( _.loading.queue.indexOf( codePath ) < 0 ) {
// _debug( 'importing', codePath );
					_.loading.load( codePath );// push path into loading queue
					
				}// if
			},// _import
			_class : function ( codeName ) {
// _debug( 'creating stub class for', codeName );
				var stub = { 
					_extends : function( superName ) {
						this._super = superName;//set super name for definition tree
					}// _extends
				};// return object
				window[ codeName ] = stub;
				return window[ codeName ];
			},// _class ( temp )
			load : function( codePath, first ) {
// _debug( 'loading', codePath );
				try{
					this.queue.push( codePath);
					var host = document.location.host;
					var scriptURL = 'src/' + codePath.replace( /\./g, '/' ) + '.js';
					function _xhr () { 
						var request = new XMLHttpRequest();
						request.open.apply( request, arguments );
						return request;
					};// _xhr
					var request = _xhr( 'GET', scriptURL, false )
					request.send( null );
					if ( request.status == 200 ) {
// _debug( '>>> loaded', codePath, '. processing imports' );
						_import = _.loading._import;
						_class = _.loading._class;
						try{
							eval( request.responseText );
						}catch( error ){
							throw 'error completing imports for '+  codePath + '. Error Text :' + error;
						}
						var codeName = codePath.split( '.' ).pop();
						window[ codeName ]._script = request.responseText//store script
						_.definition.queue.push( codeName );// add script to definition queue
						_debug( 'L[ ' + this.queue.map( function( o ){ return o.split( '.' ).pop() } ).sort().join(' ') );
						_debug( 'D[ ' + _.definition.queue.map( function( o ){ return o.split( '.' ).pop() } ).sort().join(' ') );
// _debug( '<<< finished loading tasks for', codePath)
						if( this.queue.length == _.definition.queue.length ){
							_.definition.defineClasses();
						}// if
						
					} else if ( status == 0 ) {
						// eval( responseText );
					} else {// else if
						throw status ;
					};// else
				}catch( error ){
						throw 'error loading '+  codePath + '. Error Text :' + error;
				}
			},// load
		},// loading
		definition : {
			initializing : false,
			queue : [],
			_import : function( codePath, immediately ) {
			},// _import
			_class : function( codeName, properties ) {
_debug( '_class', codeName );
				if(! window[ codeName ]._constructor ) { // if class is stub
					var newClass = Class._plus( codeName, properties );// create the class from ClassObject
					newClass._extends = function( parentCodeName, properties ) {
_debug( '_extends', parentCodeName );
							window[ codeName ] = window[ parentCodeName ]._plus( codeName, properties );
						 	window[ codeName ]._codeName = codeName;
					};// _extends
					window[ codeName ] = newClass;
				} 
				return window[ codeName ]
			 },// _class
			defineClasses : function () {
_debug( 'defining classes' );
				var codeName;
				while ( codeName = this.queue[ 0 ] ) {
					if (! window[ codeName ]._constructor ) {
						this.define( codeName );
					}// if
				}// while
				_.application();// app is good to go.
			},// defineClasses
			define : function ( codeName ) {
				window._class = _.definition._class;// switch _class
				window._import = _.definition._import;// switch _import
				var index = this.queue.indexOf( codeName );
				if( index >= 0 ) {
					var code = window [ codeName ];
					this.queue.splice( index, 1);
_debug( 'defining class', codeName );
					if ( code._super ){
_debug( 'defining superclass', code._super );
						this.define(code._super);
					}// if
// _debug( 'evaluating script', code._script );
					try{
						eval( code._script );
					}catch( error ){
						throw 'error defining '+ codeName + '. Error Text :' + error;
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
		if( _.codeDebug ) _trace.apply( this, arguments );
	};// //_debug
	
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
	  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	  // The base Class implementation -- 
	  // provides _get and _set shortcuts to eliminate abiguous assignment ( is it a  property or a getSetter ? )
	  // provides .add() to replace += 
	  window.Class = function(){};
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
	Class._plus = function(codeName, additions) {
		var _super = this.prototype;
		
		// Instantiate a base class (but only create the instance,
		// don't run the _config constructor)
		_.definition.initializing = true;
		var newPrototype = new this();
		newPrototype._codeName = codeName;
		newPrototype.toString = function () { return '[Code '+this._codeName+']'; } 
		_.definition.initializing = false;
		
		// The dummy class constructor
		function ClassObject() {
		  // All construction is actually done in the _config method (declared using the new Class name as string (codeName ) )
		  this._ = _.util.deepCopy( this._ );
		  
		 
			if ( !_.definition.initializing ){
				
if ( this._codeName.indexOf( 'Event' ) < 0 && [ 'Dictionary' ].indexOf( this._codeName ) < 0 ) {
	_debug( 'new', this._codeName );
};
				for ( var propertyName in this ){
					var property = this[ propertyName ];
					if ( typeof property == 'function' && [  'toString',
															 '_get',
															 '_set',
															 '_add' ].indexOf( propertyName) < 0 ){
// _debug( 'scoping', propertyName, 'to', this );
						this[ propertyName ] = _.util.scope( property, this, propertyName );
					};//if
				};//for
				
				for ( var propertyName in this._ ){
					var property = this._[ propertyName ];
					if ( typeof property == 'function' ){
						this._[ propertyName ] = _.util.scope( property, this );
					}//if
				}//for
			  	if( this._config ) {
			 		this._config.apply( this, arguments );
			  	};
			}
		}
		
		newPrototype._ = _super._ ? _.util.deepCopy( _super._ ) : {}; // private space
		
		// TODO: getter/setters proper
		// newPrototype.__ = _.util.deepCopy( _super.__ ) || {};
// 		
		// newPrototype.__.getters = newPrototype.__.getters || {};
		// newPrototype.__.setters = newPrototype.__.setters || {};
		
		// var getSetters = [];
		// Copy the properties over onto the new prototype
		for (var name in additions) {
			var addition = additions[ name ];
			var	propertyKeyword;
			var	propertyType;
			var propertyName = name;
			var propertyDefault = '[function]';
			var attachTarget = {};
			// TODO: getter/setters proper
			// if ( name.indexOf( 'get_' ) >= 0 ) {
				// propertyKeyword = 'get';
				// propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				// attachTarget = newPrototype.__.getters;
				// if ( getSetters.indexOf(propertyName) < 0 ){
					// getSetters.push( propertyName );
				// }
			// }
			// if ( name.indexOf( 'set_' ) >= 0 ) {
				// propertyKeyword = 'set';
				// propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				// attachTarget = newPrototype.__.setters;
				// if ( getSetters.indexOf(propertyName) < 0 ){
					// getSetters.push( propertyName );
				// }
			// }
			if ( name.indexOf( 'private_' ) >= 0 ) {
				propertyKeyword = 'private';
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				attachTarget = newPrototype._;
			} else if ( name.indexOf( 'static_' ) >= 0 ) {
				propertyKeyword = 'static';
				attachTarget = ClassObject;
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
			} else if ( name === codeName ){
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
_debug('\t', propertyKeyword, propertyType, propertyName, propertyDefault );
		}
		// TODO: getter/setters proper
		// for ( var index in getSetters ) {
			// var getSetterName = getSetters[index];
			// newPrototype[ getSetterName ] = (function ( getFunction, setFunction ) { return function ( value ) {
				// getFunction = getFunction || function () {};
				// setFunction = getFunction || function () {};
				// if ( value === undefined ) {
					// return getFunction.call( this )
				// }
				// setFunction.apply( this, value );
			// } } )( additions['get_' + getSetterName ] )( additions[ 'set_' + getSetterName ] );
		// }
		// Populate our constructed prototype object
		ClassObject.prototype = newPrototype;
		
		// Enforce the constructor to be what we expect
		ClassObject.constructor = ClassObject;
		
		// And make this class extendable
		ClassObject._plus = arguments.callee;
		
		return ClassObject;
	};
			
			
	window.Code = function( applicationCodePath ) {
_debug( 'starting Code with application', applicationCodePath );
		var applicationCodeName = applicationCodePath.split( '.' ).pop();
		_.application = ( function( applicationCodeName ) {
			return function () {
_debug( 'starting', applicationCodeName )
			 	_.application = new window[ applicationCodeName ]();
			}// return function
		} )( applicationCodeName );//closure
		_import( applicationCodePath );
		window.Code = window._
	}
_debug('code ready.')

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Goin' Deep /////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
	
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
	function copy( target ) {
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
		CodeConstructor: DeepCopier,
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
		CodeConstructor : DeepCopyAlgorithm,
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
	
	function deepCopy(source, maxDepth) {
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
				return clone( source.constructor.prototype );
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
	deepCopy.register({// null
		canCopy: function(source) {
			return ( source === null );
		},
		create: function(source) {
			return null;
		},
		populate: function(deepCopy, source, result) {
			return null;
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
	deepCopy.register({//regexp
		canCopy: function(source) {
			return ( source instanceof RegExp );
		},
		create: function(source) {
			return source;
		}
	});
	function isNode(source) {
		if ( window.Node ) {
			return source instanceof Node;
		} else {
			return ( source === document ) || (
				typeof source.nodeType === 'number' &&
				source.attributes &&
				source.childNodes &&
				source.cloneNode
			);
		};
	};
	deepCopy.register( {//dom elements
		canCopy: function(source) {return isNode(source); },
		create: function(source) {
			return ( source === document ) ? document : source.cloneNode(false);
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
	deepCopy.register( {//fase Dictionary
		canCopy: function(source) { return source._codeName == 'Dictionary'; },
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
})();