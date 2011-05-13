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

	window._ = {};//                                             * Reserving global._ *
	
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
			return new source.constructor();
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
	
	
	console.log('code loaded.');

	window.CodeObject = false;
			
	_null = function () {// null binding reserved for future use
		return null;
	};
	_trace = function( seriously ) {
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
		if( ( _.loading.processed.indexOf( url ) < 0 )  ){
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
					eval(responseText);
					_.loading.complete.push(url);
					_.loading.processQueue();
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
	
	_.loading.batchImport = function( queue ){
 		_.loading.queue = _.loading.queue.concat( queue );
 		_.loading.processQueue();
	};
	 
	_.loading.processQueue = function( queue ) {
	 	
		if ( _.loading.complete.length == _.loading.queue.length ) {
			return window.onCodeReady();
		}else{
			_import( _.loading.queue[ _.loading.complete.length] );
		};
	};
	
	_package = function( packageName, imports, classClosure ) { // Future Use
		var branch = window;
		for ( branchName in Array( packageName ).explode( '.' ) ) {
			branch = branch[ branchName ] = branch[ branchName ] || {};
		};
		importList( imports, classClosure );
	}

	_class = function( codeName, properties ) {
		var newClass =  ( CodeObject ? CodeObject._plus( properties ) : Class._plus( properties ) );
	    newClass._codeName = codeName;
	    newClass._extends = function( parentCodeName, properties ) {
	       window[ codeName ] = window[ parentCodeName ]._plus( codeName, properties );
	    	window[ codeName ]._codeName = codeName;
	    };
	    window[ codeName ] = newClass;
		return window[ codeName ];
	};
	
// DON'T GET CUTE.

	window.Class = function () { };
	window.Class._plus = function( className, additions ) {
		if ( className ){
			_trace( 'Class' , className );
		}
		var initializing = false;
		var oldPrototype = this.prototype;
		
		initializing = true;
		var newPrototype = new this();

		initializing = false;
		 newPrototype._ = oldPrototype._ || {};

		function Code() {
	  		if (! initializing && this.init ) {
		   		this._super = function(value){
		   			if ( value === undefined ) {
		   				return this.__proto__;
		   			}
		   				return this.__proto__.constructor.apply( this , arguments );
		   		}
		   		this._ = _.util.deepCopy( this._ );
		   		this._codeName = className;
		   		this._super( arguments );
		   		this.init.apply( this, arguments );
		   	};
		};
	 	for ( var name in additions ) {
			var	propertyKeyword;
			var propertyName = name;
			
	 		attachTarget = {};
	 		if ( name.indexOf( 'private_' ) >= 0 ) {
				propertyKeyword = 'private';
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
				attachTarget = newPrototype._;
			} else if ( name.indexOf( 'static_' ) >= 0 ) {
				propertyKeyword = 'static';
				attachTarget = Code;
				propertyName = name.substring( name.indexOf( propertyKeyword )  + propertyKeyword.length + 1 , name.length );
			} else {
				propertyKeyword = 'public';
				attachTarget = newPrototype;
			};
			var propertyType;
			var property;
	 		if(typeof additions[ name ] == 'function' && typeof oldPrototype[name] == 'function'){
	 			propertyType = 'function';
	 			property = ( function( name, fn ) {
			   		return function() {
			        	// var tmp = oldPrototype;
			            // oldPrototype = oldPrototype[name];
			           	var ret = fn.apply( this, arguments );
			           	// oldPrototype = tmp;
			           	return ret;
			       	};
			  	} )( propertyName, additions[ name ] )
	 		}else{
	 			propertyType = 'var';
	 			property = _.util.deepCopy( additions[ name ] );
	 		}
			
			
			attachTarget[ propertyName ] =  property;
			if(propertyName != 'init'){ 
				_trace( propertyKeyword, propertyType, propertyName)
			}
		}
		newPrototype._ = _.util.deepCopy(newPrototype._);
		Code.prototype = newPrototype;
	 	Code.constructor = Code;
	 	Code._codeName = className
	  	Code._plus = arguments.callee;
	  	return Code;
	}
		
//		Code initializer
		
	Code = function(modules,application) {
		_trace( Date.toString(), ': running Code.js', ( modules ? 'with '+ modules.length + ' modules' : "" ) );
		onCodeReady = application || function () { _trace( 'no application provided'); } ;
		// init to win it.
		_class('CodeObject')._extends('Class');
		// load modules
		for(index in modules){
			_.loading.queue = _.loading.queue.concat( modules[ index ]() );
			_.loading.processQueue()
		};
	}
})();