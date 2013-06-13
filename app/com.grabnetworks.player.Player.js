/*!
 *
 * Code.js
 *
 * Class / Object Description Engine for Javascript
 *
 * https://github.com/neuromantic/CodeJS
 *
 * Copyright 2013, Neuromantic Industries http://www.neuromantic.com
 * Licensed under the MIT license.

 * The original concept for this project and early versions of the code (as FaseJS) were co-created by
 * Ross Sclafani, http://ross.sclafani.net and Edward Hotckiss, http://www.edwardhotchkiss.com/
 * (Hotchkiss is also attributed in some parts of this code as `For Sure, Rad!`)
 *
 * Many thanks to the original authors, and the Open Source Software community at large
 *
 */
( function() {
    global = ( typeof window === 'object' ) ? window : ( typeof global === 'object' ) ? global : { dev: null };
    console = console || {};
    console.log = console.log || function() {};
    var fs, path, ast, ugg, http;
    if ( typeof require === 'function' && typeof window === 'undefined') {
        fs = require('fs');
        path = require('path');
        ast = require('uglify-js').parser;
        ugg = require('uglify-js').uglify;
        http = require('http');
    }
    var _ = {
        debugging: 0,
        application: {},
        util: {
            lookup : function ( path ) {
                var scope = global;
                var tokens = path.split( '.' );
                for ( var i = 0; i < tokens.length; i++ ) {//create lookup tree
                    var token = tokens[ i ];
                    scope = scope[ token ] = scope[ token ] || {};
                }
                return scope;
            },
            stringify: function( obj, done ) {
                if ( typeof obj === 'undefined' ) {
                    return '{undefined}';
                }
                if ( obj === null ) {
                    return '{null}';
                }
                if ( obj.tagName ) {
                    return '<' + obj.tagName + '>';
                }
                var s = '',
                    val;
                if (obj instanceof Array) {
                    s += '[ ';
                    for (var i = 0; i < obj.length; i++) {
                        val = obj[i];
                        val = _.util.stringify(val, true);
                        s += val + ',';
                    }
                    s = s.slice(0, - 1);
                    s += ' ]';
                    return s;
                }
                switch ( typeof obj ) {
                case 'object':
                    s += '{ ';
                    for ( var key in obj ) {
                        val = obj[ key ];
                        var type = typeof val;
                        if ( done ) {
                            val = ( type === '{object}' || type === '{function}' ) ? type : val;
                        }
                        else {
                            val = _.util.stringify( val, true );
                        }
                        s += ' ' + key + ' : ' + val + ',';
                    }
                    s = s.slice( 0, -1 );
                    s += ' }';
                    return s;
                case 'function':
                    return '{function}';
                default:
                    return obj;
                }
            },
            deepCopy: deepCopy,
            scope: function( fn, scope, functionName ) {
                return function() {
                    var temp = {};
                    function explodeImports( scope ) {
                        if( scope._imports ) {//explode imports
                            for ( var i = 0; i < scope._imports.length; i++ ) {
                                var classPath = scope._imports[ i ];
                                var className = classPath.split( '.' ).pop();
                                if( ! temp[className] ){
                                    temp[ className ] = global[ className ];
                                    var importedClass = _.util.lookup( classPath );
                                    if ( classPath !== scope._classPath ){
                                        explodeImports( importedClass );
                                    }
                                    global[ className ] = importedClass;
                                }
                            }
                        }
                    }
                    explodeImports( scope );
                    var value = fn.apply( scope, arguments );
                    for (var key in temp){
                        global[ key ] = temp[ key ];
                    }
                    return value;
                }; //closure
            }, //scope
            isMethod: function(property) {
                return ( ( typeof property === 'function' ) && (! ( property instanceof RegExp ) ) );
            } //isMethod
        }, // util
        loader: {
            packagePath: '',
            queue: [],
            currentClass : {},
            _package : function ( packagePath ){
_debug( '_.loader._package', packagePath );
                _.util.lookup( packagePath )[ _.loader.currentClass.name ] = _.loader.currentClass.code;
            },
            _import: function( classPath ) { //--------------------------------------------------------------- loader._import (load)
_debug( '_.loader._import', classPath );
                if ( _.loader.queue.indexOf( classPath ) < 0 ) {
                    _.loader.load( classPath ); // push path into loading queue
                } // if
            }, // _import
            _class: function( className) { //--------------------------------------------------------------- loader._class (stub)
_debug( '_.loader._class', className );
_verbose( 'creating stub class for', className);
                var stub = {
                    _extends: function( superName ) {
_verbose( 'which extends', superName );
                        this._super = superName; //set super name for definition tree
                    } // _extends
                }; // stub
                _.loader.currentClass = { name: className, code: stub };
                return stub;
            }, // _class
            load: function( classPath ) {
_debug( 'loading', classPath )
                var code, scriptPath;
                //TODO: http classPaths
                var binPath = 'bin/' + classPath;
                scriptPath = 'src/' + classPath.replace( /\./g, '/' ) + '.js';
                try {
                    this.queue.push(classPath);
                    if ( fs && path && ast && ugg ) { //server
                        try {
_verbose( 'looking for bytecode in', binPath );
                            code = fs.readFileSync( binPath );
                        }
                        catch ( e ) {
_verbose( 'no bytecode available.' );
                            try {
_verbose( 'loading source code from', scriptPath) ;
                                code = fs.readFileSync(scriptPath, 'ascii');
                                try {
_verbose( 'generating bytecode for', classPath, 'source bytes =', code.length );
                                    if (! _.debugging ) {
                                        code = ast.parse( code ); // parse code and get the initial AST
                                        if ( classPath == 'Code' ) {
                                            code = ugg.ast_mangle( code ); // get a new AST with mangled names
_verbose( 'mangling', classPath );
                                        }
                                        code = ugg.ast_squeeze( code ); // get an AST with compression optimizations
_verbose( 'squeezing', classPath );
                                        code = ugg.gen_code( code ); // compressed code here

                                        code = ( code.substr( 0, -1 ) === ';' ) ? code : ( code + ';' ) + '\n';
                                    }
                                    if (! path.existsSync( 'bin/' ) ) {
                                        _info( 'creating bin' );
                                        fs.mkdirSync( 'bin/' );
                                    }
_debug( 'writing bytecode to', binPath, 'final bytes =', code.length );
                                    fs.writeFileSync( binPath, code );
                                }
                                catch ( error ) {
_error( 'error creating bytecode' );
                                    throw error;
                                }
                            }
                            catch ( error ) {
_error( 'file system error' );
                                throw error;
                            }
                        }
                    }
                    else if ( typeof XMLHttpRequest == "function" ) { //client //
_verbose( 'streaming source code from', scriptURL );
                        var scriptURL = scriptPath;
                        var request = new XMLHttpRequest();
                        request.open( 'GET', scriptURL, false );
                        request.send( null );
                        if ( request.status == 200 ) {
                            code = request.responseText;
                        }
                        else { // else if
_error('XMLHttpRequest error');
                            throw new Error( request.status );
                        } // else
                    }
                }
                catch (error) {
_error( 'error loading', classPath, ':', error.message );
                    throw error;
                }
_verbose( 'loaded', classPath, 'successfully. processing imports' );
                try {
                    global._package = this._package; // lookup stub
                    global._import = this._import; //load
                    global._class = this._class; //stub
                    code = code.toString();
                    if( classPath != 'Code' && code.indexOf('_package') > -1 && code.indexOf('_class') > -1 ) {
                        _verbose('evaluating source for ', classPath)
                        eval( code );
                    }
                } catch (error) {
_error('error completing imports for ' + classPath + '. Error Text:' + error.message);
                    throw error;
                }
                var stub = _.util.lookup( classPath );
                stub._script = code; //store script
                _.compiler.queue.push(classPath); // add script to compilation queue
                if (this.queue.length == _.compiler.queue.length) {
                    _.compiler.compileClasses();
                    this.queue = [];
                } // if
            } //, load
        }, // loader
        compiler: {
            buffer: '',
            queue: [],
            _package : function ( packagePath ){
_debug( '_.compiler._package', packagePath );
_verbose( 'nothing to do' );
            },
            _import : function( classPath ) {
_debug( '_.compiler._import', classPath );
_verbose( 'nothing to do' );
            }, // _import
            _class: function( className ) {
_debug( '_.compiler._class', className );
_verbose( 'null extender' );
                return {
                    _extends: function() {}
                };
            },
            compileClasses: function() {
_verbose( 'compiling classes' );
                var className;
                while (className = this.queue[0]) {
                    this.compile(className);
                } // while
                _.interpreter.defineClasses();
                this._queue = [];
            }, // compileClasses
            compile: function(classPath) {
                 var index = this.queue.indexOf(classPath);
                if (index >= 0) {
                    this.queue.splice(index, 1);
                    var stub = _.util.lookup( classPath );
_verbose( 'adding class', classPath );
                    global._package = this._package;
                    global._import = this._import;
                    global._class = this._class;
                    var code = stub._script;
                    if( classPath != 'Code' && code.indexOf('_package') > -1 && code.indexOf('_class') > -1 ) {
                        _verbose('evaluating source for ', classPath)
                        eval( code );
                    }
                    this.buffer = this.buffer.concat( code );
_verbose( this.buffer.length, 'bytes', this.queue.length, 'scripts remain.' );
                } // if
            } //compile
        }, // compiler
        interpreter : {
            initializing : false,
            imports : [],
            packagePath: null,
            currentClass : {},
            _package: function( packagePath ) {
_verbose( '_.interpreter._package', packagePath );
                var classPath = packagePath + '.' + _.interpreter.currentClass.name
                _.interpreter.currentClass.code._imports.push( classPath );
                _.interpreter.currentClass.code._classPath = classPath;
                _.util.lookup( packagePath )[ _.interpreter.currentClass.name ] = _.interpreter.currentClass.code;
                _.interpreter.imports = [];
            },
            _import: function(classPath) { //--------------------------------------------------------------- interpreter._import (null)
_verbose( '_.interpreter._import', classPath );
                    _.interpreter.imports.push( classPath );
            }, // _import
            _class: function(className, properties) { //--------------------------------------------------------------- interpreter._class define
_debug( '_.interpreter._class', className );
                var newClass = Class._plus( className, properties ); // create the class from Class object
                newClass._extends = function( parentClassName, properties ) {
_debug( '_extends', parentClassName );
                    var parentPath;
                    for( var i = 0; i < _.interpreter.imports.length; i++ ){
                        if( _.interpreter.imports[ i ].indexOf( parentClassName) > -1){
                            parentPath = _.interpreter.imports[ i ];
                        }
                    }
                    if(typeof parentPath === 'undefined') {
                        throw new TypeError( className + ' cannot _extend ' + parentClassName + ', it has not been _imported.' );
                    }
_verbose( '_extending', parentPath );
                    var subClass = _.util.lookup( parentPath )._plus( className, properties );
                    subClass._className = className;
                    subClass._imports = _.interpreter.imports;
                    _.interpreter.bakeClass( subClass );
                }; // _extends
                newClass._className = className;
                newClass._imports = _.interpreter.imports;
                _.interpreter.bakeClass( newClass );
                return newClass;
            }, // _class
            bakeClass: function( classObject ){
_verbose( 'baking', classObject.toString() );
                for( var key in classObject){
                    var property = classObject[ key ];
                    if( [ classObject._className, '_plus', 'toString', '_extends'].indexOf( key ) === -1 && _.util.isMethod( property ) ){
_verbose( 'scoping static', key );
                        classObject[ key ] = _.util.scope( property, classObject, key );
                    }
                }
                _.interpreter.currentClass = { name : classObject._className, code : classObject };
            },
            defineClasses: function() {
_debug( 'defining classes' );
                global._package = this._package; //reset imports
                global._import = this._import; // register imports
                global._class = this._class; // define / extend class
                eval(_.compiler.buffer);
                _.compiler.buffer = '';
            } //defineClasses
        } // interpreter
    }; // _
    global.DebugLevels = {
        SILENT: 0,
        ERRORS: 1,
        WARNINGS: 2,
        INFO: 3,
        DEBUG: 4,
        VERBOSE: 5
    };
    //DebugLevels.LABELS = ['SILENT', 'ERROR', 'WARNING', 'INFO', 'DEBUG', 'VERBOSE'];
    _trace = function() {
        var output = "";
        var args = arguments;
        for (var index in args) {
            var token = _.util.stringify(args[index]);
            output += token + (' ');
        } // for
        console.log(output);
    }; // _trace

    _error = function() {
        if (_.debugging >= DebugLevels.ERRORS) _trace.apply( this, arguments );
    };//
    _warn = function () {
        if (_.debugging >= DebugLevels.WARNINGS) _trace.apply( this, arguments );
    };//
    _info = function () {
        if (_.debugging >= DebugLevels.INFO) _trace.apply( this, arguments );
    };//
    _debug = function () {
        if (_.debugging >= DebugLevels.DEBUG) _trace.apply( this, arguments );
    };//
    _verbose = function () {
        if (_.debugging >= DebugLevels.VERBOSE) _trace.apply( this, arguments );
    };//


    // DON'T GET CUTE.


    /*
     *
     * Class is a modification of 'Class'
     * by the immortal John Resig
     *
     * http://bit.ly/4U5H
     *
     * 'spect.
     *
     */
    //var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation --
    // provides _get and _set shortcuts to eliminate abiguous assignment ( is it a property or a getter / setter ? )
    // provides _add() to replace +=
    // provides _expose() to allow one ClassObject to "wear" the public API of another without overlapping existing methods
    var Class = function() {};
    Class._className = 'Class';
    Class.prototype = {
        _get: function(propertyName) {
            var property = this[propertyName];
            if (property === undefined) {
                return undefined;
            }
            return (typeof this[propertyName] == 'function') ? this[propertyName]() : this[propertyName];
        },
        _set: function(propertyName, value) {
            var property = this[propertyName];
            if (property === undefined) {
                this[propertyName] = value;
            }
            else {
                (typeof this[propertyName] == 'function') ? this[propertyName](value) : this[propertyName] = value;
            }

        },
        _add: function(value, propertyName) {
            value = value || 1;
            var property = this[propertyName];
            if (property === undefined) {
                this[propertyName] = value;
            }
            else {
                (typeof this[propertyName] == 'function') ? this[propertyName](this[propertyName]() + value) : this[propertyName] += value;
            }
        },
        _expose : function ( api ){
            for( var i in api ){
                if( typeof api[ i ] === 'function' && typeof this[i] === 'undefined' ){
                    this[ i ] = api[ i ];
                }
            }
        },
        toString: function() {
            return '[' + this._className + ']';
        }
    };

    // Create a new Class that inherits from this class
    Class._plus = function(className, additions) {
        // Instantiate a base class (but only create the instance,
        // don't run the __init__ constructor)
        _.interpreter.initializing = true;
        var newPrototype = new this();
        _.interpreter.initializing = false;
        newPrototype._className = className;
        newPrototype._imports = _.interpreter.imports;
        var superPrototype = this.prototype;

        newPrototype._ = superPrototype._ ? _.util.deepCopy(superPrototype._) : {}; // private space 
        var getters = {};
        var setters = {};
        var accessors = [];
        for (var name in additions) {
            var addition = additions[name];
            var propertyKeyword;
            var propertyType;
            var propertyName = name;
            var propertyDefault = '[function]';
            var attachTarget = {};

            // TODO: getter/setters proper ?

            if (name.indexOf('private_') >= 0) {
                propertyKeyword = 'private';
                propertyName = name.substring(name.indexOf(propertyKeyword) + propertyKeyword.length + 1, name.length);
                attachTarget = newPrototype._;
            }
            else if (name.indexOf('static_') >= 0) {
                propertyKeyword = 'static';
                attachTarget = ClassObject;
                propertyName = name.substring(name.indexOf(propertyKeyword) + propertyKeyword.length + 1, name.length);
            }
            else if (name.indexOf('get_') >= 0) {
                propertyKeyword = 'get';
                attachTarget = getters;
                propertyName = name.substring(name.indexOf(propertyKeyword) + propertyKeyword.length + 1, name.length);
                if (accessors.indexOf(propertyName) == -1) {
                    accessors.push(propertyName);
                }
            }
            else if (name.indexOf('set_') >= 0) {
                propertyKeyword = 'set';
                attachTarget = setters;
                propertyName = name.substring(name.indexOf(propertyKeyword) + propertyKeyword.length + 1, name.length);
                if (accessors.indexOf(propertyName) == -1) {
                    accessors.push(propertyName);
                }
            }
            else if (name === className) {
                propertyKeyword = 'constructor';
                attachTarget = newPrototype;
                propertyName = '__init__';
            }
            else {
                propertyKeyword = 'public';
                attachTarget = newPrototype;
            }
            var property;
            if (typeof addition == 'function') {
                propertyType = 'function';
                property = enableSuper( propertyName, addition, superPrototype );
            }
            else {
                propertyType = 'var';
                propertyDefault = addition;
                property = _.util.deepCopy(addition);
            }
            attachTarget[propertyName] = property;
_verbose('\t', propertyKeyword, propertyType, propertyName, '=', propertyDefault);
        }
        function noConstructor(){
            this._super.apply(this, arguments);
        }
        if( typeof additions !== 'undefined' && typeof additions[ className ] !== 'function' ){
            newPrototype.__init__ = enableSuper( '__init__', noConstructor, superPrototype );
        }
        function enableSuper( propertyName, fn, _super ) {
            return ( function( propertyName, fn, _super ) {
                return function() {
                    var tmp = this._super;
                    // Allow this._super() to call superconstructor, and allow this._super().*() to call the super method
                    this._super = function() {
                        if (propertyName === '__init__') {
                            var __init__ = _super.__init__ || function() {};
                            _super = _super._superPrototype;
                            return __init__.apply(this, arguments);
                        }
                        else {
                            sup = { _ : {} };
                            var publicName, publicMember;
                            for ( publicName in _super ) {//public
                                var publicMember = enableSuper(publicName, _super[ publicName ], _super );
                                if (typeof publicMember === 'function') {
                                    sup[ publicName ] = _.util.scope( publicMember, this, publicName );
                                }
                            }
                            var privateName, privateMember;
                            for ( privateName in _super._ ) {//'private'
                                privateMember = enableSuper( privateName, _super._[ privateName ], _super );
                                if ( typeof privateMember === 'function' ) {
                                    sup._[ privateName ] = _.util.scope( privateMember, this, privateName );
                                }
                            }
                            _super = _super._superPrototype;
                            return sup;
                        }
                    };
                    // The __init__ method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    _super = superPrototype;
                    return ret;
                };
            })( propertyName, fn, _super );
        }
        // Create getter / setter properties
        for (var index in accessors) {
            var accessor = accessors[index];
_verbose( 'property name:', accessor);
            var getter = getters[accessor] || superPrototype[accessor];
            var setter = setters[accessor] || superPrototype[accessor];
            newPrototype[accessor] = (function(getter, setter, accessor) {
                return function(value) {
                    if (value === undefined) {
                        if (getter) {
                            return getter.call(this);
                        }
                        else return;
                    }
                    if (setter) {
                        setter.call(this, value);
                    }
                };
            })(getter, setter, accessor);
        }
        // The dummy class constructor (scoping)
        function ClassObject() {
            // All construction is actually done in the __init__ method (declared using the new Class name as string ( _className ) )
            this._ = _.util.deepCopy(this._);
            if (!_.interpreter.initializing) {
_debug( 'new', this._className );
                for (var propertyName in this) {
                    var property = this[propertyName];
                    if (_.util.isMethod(property) && ['toString', '_get', '_set', '_add'].indexOf(propertyName) < 0) {
_verbose( 'scoping public', propertyName );
                        this[propertyName] = _.util.scope(property, this, propertyName);
                    } //if
                } //for
                for (propertyName in this._) {
                    var property = this._[propertyName];
                    if (_.util.isMethod(property)) {
_verbose( 'scoping private', propertyName );
                        this._[propertyName] = _.util.scope(property, this);
                    } //if
                } //for
                if (this.__init__) {
                    this.__init__.apply(this, arguments);
                } //if
            } //if
        }
        //inheritance chain
        newPrototype._superPrototype = superPrototype;
        // Populate our constructed prototype object
        ClassObject.prototype = newPrototype;

        // Enforce the constructor to be what we expect
        ClassObject.constructor = ClassObject;

        // And make this class extensible
        ClassObject._plus = arguments.callee;
        ClassObject.toString = function (){
            return '('+ this._className + ')';
        };

        return ClassObject;
    };

    var Code = function() {
        return Code.c('Code');
    };
    Code.r = function(applicationClassPath, parameters) {
_debug( 'Code.r(', applicationClassPath, ',', _.util.stringify(parameters), ')' );
        global._package = _.loader._package;
        global._import = _.loader._import;
        global._class = _.loader._class;
        _import( applicationClassPath );
_verbose( 'executing' );
        var Application = _.util.lookup( applicationClassPath );
		new Application( parameters );
    };
    Code.x = function(applicationClassPath, applicationFileName) {
_debug( 'Code.x(', applicationClassPath, ',', applicationFileName, ')' );
        applicationFileName = applicationFileName || applicationClassPath + '.js';
        var applicationDirectoryName = 'app';
        var applicationFilePath = applicationDirectoryName + '/' + applicationFileName;
        if( fs.existsSync( applicationFilePath ) ){
            return fs.readFileSync( applicationFilePath );
        }
		var start = '( function (){\n';
	    var code;
		try{
_debug( 'getting Code.js from file system' );
			code = Code();
		}catch (error){
_error( 'src/Code.js could not be read:\n'+ error.message );
			throw( error );
	    }
        
		var app;
		try{
_verbose( 'compiling', applicationClassPath , 'from source files' );
				app =  Code.c( applicationClassPath );
	    } catch ( error ) {//try
_error( applicationClassPath + ' could not be compiled:\n'+ error.message );
			throw( error );
		}
_verbose( 'creating exec statement' );
		var exec = 	'var scripts = document.getElementsByTagName( "script" );\n'+
					'var script = scripts[ scripts.length - 1 ];\n'+
					'var query = script.src.split("?")[1];\n'+
	                'if( query && query.length > 0 ){\n'+
						'\tvar settings = {};\n'+
						'\tvar list = query.split( "&");\n'+
						'\tfor (var i = 0; i < list.length; i++ ){\n'+
							'\t\tvar pair = list[i].split("=");\n'+
							'\t\tsettings[pair[0]] = pair[1];\n'+
						'\t};\n'+
						'\tnew ' + applicationClassPath + '( settings );\n'+
                    '}\n';
        var end = '})();';
_debug( 'Code.js:', code.length, 'bytes' );
_debug( 'start statement:', start.length, 'bytes' );
_debug( 'App:', app.length, 'bytes' );
_debug( 'exec statement:', exec.length, 'bytes');
_debug( 'end statement:', end.length, 'bytes')
	    if( start && app && code && exec && end) {
            if( !fs.existsSync( applicationDirectoryName) ){
_debug( 'creating app directory');
                fs.mkdir( applicationDirectoryName );
            }else{
                if( fs.existsSync( applicationFilePath )){
_debug( 'removing cached copy');
                    fs.unlinkSync( applicationFilePath );
                }
            }
_debug( 'saving script file');
            var file = code + start + app + exec + end;
            try{
                fs.writeFileSync( applicationFilePath, file );
            }catch( e ){
                _trace ("W T FFFFFFFFFF", e);
            }
_debug( 'returning executable script');
			return( file);
	    }else{//if
_error( 'incomplete app, not sending.' );
	        throw  'Error  ' + applicationClassPath + ' not found.';
	    }//else
	};





    Code.c = function(applicationClassPath) {
_debug( 'Code.c(', applicationClassPath, ')' );
        var libPath = 'lib/' + applicationClassPath + '.js';
        var buffer;
        if (fs && path && path.existsSync( libPath ) ) {
                buffer = fs.readFileSync(libPath, 'ascii');
        }else{
_warn( 'no library at', libPath );
        }
        if (!buffer) {
            _.interpreter = {
                defineClasses: function() {
_verbose( 'bypassing interpreter.' );
                }
            };
            global._import = _.loader._import;
            _import(applicationClassPath);
            buffer = _.compiler.buffer;
            if (fs && path) {
                if (!path.existsSync('lib/')) {
_debug( 'creating lib folder' )
                    fs.mkdirSync('lib/');
                }
_debug( 'saving lib file to', libPath );
                fs.writeFileSync(libPath, buffer);
            }
            _.compiler.buffer = '';
        }
        return buffer;
    };
    Code._ = _;
    global.Code = Code;
    global._package = _.interpreter._package;
    global._import = _.interpreter._import;
    global._class = _.interpreter._class;
_debug( 'Code.js is ready. @2013 Neuromantic, LLC. All Rights reserved. Licenced under the MIT license.' );

    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Goin' Deep /////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    //     DEEP COPY props http://oranlooney.com/deep-copy-javascript/
    //	   This section is part of OWL JavaScript Utilities.
    //
    //	OWL JavaScript Utilities is free software: you can redistribute it and/or
    //	modify it under the terms of the GNU Lesser General Public License
    //	as published by the Free Software Foundation, either version 3 of
    //	the License, or (at your option) any later version.
    //
    //	OWL JavaScript Utilities is distributed in the hope that it will be useful,
    //	but WITHOUT ANY WARRANTY; without even the implied warranty of
    //	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    //	GNU Lesser General Public License for more details.
    //
    //	To receive a copy of the GNU Lesser General Public License, see: <http://www.gnu.org/licenses/>.

    //	 the re-usable constructor function used by clone().
    function Clone() {}

    //	 clone objects, skip other types.
    function clone(target) {
        if (typeof target == 'object') {
            Clone.prototype = target;
            return new Clone();
        }
        else {
            return target;
        }
    }


    //	 Shallow Copy
    function copy(target) {
        var c;
        if (typeof target !== 'object') {
            return target; // non-object have value sematics, so target is already a copy.
        }
        else {
            var value = target.valueOf();
            if (target != value) {
                //				 the object is a standard object wrapper for a native type, say String.
                //				 we can make a copy by instantiating a new object around the value.
                return new target.constructor(value);
            }
            else {
                //				 ok, we have a normal object. If possible, we'll clone the original's prototype
                //				 (not the original) to get an empty object with the same prototype chain as
                //				 the original.  If just copy the instance properties.  Otherwise, we have to
                //				 copy the whole thing, property-by-property.
                if (target instanceof target.constructor && target.constructor !== Object) {
                    c = clone(target.constructor.prototype);
                    //					 give the copy all the instance properties of target.  It has the same
                    //					 prototype as target, so inherited properties are already there.
                    for (var property in target) {
                        if (target.hasOwnProperty(property)) {
                            c[property] = target[property];
                        }
                    }
                }else {
                    c = {};
                    for (var property in target) c[property] = target[property];
                }
                return c;
            }
        }
    }
    //	 Deep Copy
    var deepCopiers = [];

    function DeepCopier(config) {
        for (var key in config) this[key] = config[key];
    }
    DeepCopier.prototype = {
        constructor: DeepCopier,

        //		 determines if this DeepCopier can handle the given object.
        canCopy: function(source) {
            return false;
        },

        //		 starts the deep copying process by creating the copy object.  You
        //		 can initialize any properties you want, but you can't call recursively
        //		 into the DeeopCopyAlgorithm.
        create: function(source) {},

        //		 Completes the deep copy of the source object by populating any properties
        //		 that need to be recursively deep copied.  You can do this by using the
        //		 provided deepCopyAlgorithm instance's deepCopy() method.  This will handle
        //		 cyclic references for objects already deepCopied, including the source object
        //		 itself.  The "result" passed in is the object returned from create().
        populate: function(deepCopyAlgorithm, source, result) {}
    };

    function DeepCopyAlgorithm() {
        //		 copiedObjects keeps track of objects already copied by this
        //		 deepCopy operation, so we can correctly handle cyclic references.
        this.copiedObjects = [];
        var _this = this;
        this.recursiveDeepCopy = function(source) {
            return _this.deepCopy(source);
        };
        this.depth = 0;
    }
    DeepCopyAlgorithm.prototype = {
        constructor: DeepCopyAlgorithm,
        maxDepth: 256,
        //		 add an object to the cache.  No attempt is made to filter duplicates;
        //		 we always check getCachedResult() before calling it.
        cacheResult: function(source, result) {
            this.copiedObjects.push([source, result]);
        },
        //		 Returns the cached copy of a given object, or undefined if it's an
        //		 object we haven't seen before.
        getCachedResult: function(source) {
            var copiedObjects = this.copiedObjects;
            var length = copiedObjects.length;
            for (var i = 0; i < length; i++) {
                if (copiedObjects[i][0] === source) {
                    return copiedObjects[i][1];
                }
            }
            return undefined;
        },

        //		 deepCopy handles the simple cases itself: non-objects and object's we've seen before.
        //		 For complex cases, it first identifies an appropriate DeepCopier, then calls
        //		 applyDeepCopier() to delegate the details of copying the object to that DeepCopier.
        deepCopy: function(source) {
            //			 null is a special case: it's the only value of type 'object' without properties.
            if (source === null) return null;

            //			 All non-objects use value semantics and don't need explict copying.
            if (typeof source !== 'object') return source;

            var cachedResult = this.getCachedResult(source);

            //			 we've already seen this object during this deep copy operation
            //			 so can immediately return the result.  This preserves the cyclic
            //			 reference structure and protects us from infinite recursion.
            if (cachedResult) return cachedResult;

            //			 objects may need special handling depending on their class.  There is
            //			 a class of handlers call "DeepCopiers"  that know how to copy certain
            //			 objects.  There is also a final, generic deep copier that can handle any object.
            for (var i = 0; i < deepCopiers.length; i++) {
                var deepCopier = deepCopiers[i];
                if (deepCopier.canCopy(source)) {
                    return this.applyDeepCopier(deepCopier, source);
                }
            }
            // the generic copier can handle anything, so we should never reach this line.
            throw new Error("no DeepCopier is able to copy " + source);
        },

        //		 once we've identified which DeepCopier to use, we need to call it in a very
        //		 particular order: create, cache, populate.  This is the key to detecting cycles.
        //		 We also keep track of recursion depth when calling the potentially recursive
        //		 populate(): this is a fail-fast to prevent an infinite loop from consuming all
        //		 available memory and crashing or slowing down the browser.
        applyDeepCopier: function(deepCopier, source) {
            //			 Start by creating a stub object that represents the copy.
            var result = deepCopier.create(source);

            //			 we now know the deep copy of source should always be result, so if we encounter
            //			 source again during this deep copy we can immediately use result instead of
            //			 descending into it recursively.
            this.cacheResult(source, result);

            //			 only DeepCopier::populate() can recursively deep copy.  So, to keep track
            //			 of recursion depth, we increment this shared counter before calling it,
            //			 and decrement it afterwards.
            this.depth++;
            if (this.depth > this.maxDepth) {
                throw new Error("Exceeded max recursion depth in deep copy.");
            }

            //			 It's now safe to let the deepCopier recursively deep copy its properties.
            deepCopier.populate(this.recursiveDeepCopy, source, result);

            this.depth--;

            return result;
        }
    };

    //	 entry point for deep copy.
    //	   source is the object to be deep copied.
    //	   maxDepth is an optional recursion limit. Defaults to 256.
    function deepCopy(source, maxDepth) {
        var deepCopyAlgorithm = new DeepCopyAlgorithm();
        if (maxDepth) deepCopyAlgorithm.maxDepth = maxDepth;
        return deepCopyAlgorithm.deepCopy(source);
    }

    //	 publicly expose the DeepCopier class.
    deepCopy.DeepCopier = DeepCopier;

    //	 publicly expose the list of deepCopiers.
    deepCopy.deepCopiers = deepCopiers;

    //	 make deepCopy() extensible by allowing others to
    //	 register their own custom DeepCopiers.
    deepCopy.register = function(deepCopier) {
        if (!(deepCopier instanceof DeepCopier)) {
            deepCopier = new DeepCopier(deepCopier);
        }
        deepCopiers.unshift(deepCopier);
    }

    //	 Generic Object copier
    //	 the ultimate fallback DeepCopier, which tries to handle the generic case.  This
    //	 should work for base Objects and many user-defined classes.
    deepCopy.register({
        canCopy: function(source) {
            return true;
        },

        create: function(source) {
            if (source instanceof source.constructor) {
                return clone(source.constructor.prototype);
            }
            else {
                return {};
            }
        },

        populate: function(deepCopy, source, result) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = deepCopy(source[key]);
                }
            }
            return result;
        }
    });

    //	 Array copier
    deepCopy.register({
        canCopy: function(source) {
            return (source instanceof Array);
        },

        create: function(source) {
            return new source.constructor();
        },

        populate: function(deepCopy, source, result) {
            for (var i = 0; i < source.length; i++) {
                result.push(deepCopy(source[i]));
            }
            return result;
        }
    });

    //	 Date copier
    deepCopy.register({
        canCopy: function(source) {
            return (source instanceof Date);
        },

        create: function(source) {
            return new Date(source);
        }
    });

    //	 HTML DOM Node

    //	 utility function to detect Nodes.  In particular, we're looking
    //	 for the cloneNode method.  The global document is also defined to
    //	 be a Node, but is a special case in many ways.
    function isNode(source) {
        if (global.Node) {
            return source instanceof Node;
        }
        else {
            // the document is a special Node and doesn't have many of
            // the common properties so we use an identity check instead.
            if (typeof document == 'object' && source === document) return true;
            return (
            typeof source.nodeType === 'number' && source.attributes && source.childNodes && source.cloneNode);
        }
    }

    //	 HTMLNode copier
    deepCopy.register({
        canCopy: function(source) {
            return isNode(source);
        },

        create: function(source) {
            //			 there can only be one (document).
            if (typeof document == 'object' && source === document) return document;
            //			 start with a shallow copy.  We'll handle the deep copy of
            //			 its children ourselves.
            return source.cloneNode(false);
        },

        populate: function(deepCopy, source, result) {
            //			 we're not copying the global document, so don't have to populate it either.
            if (typeof document == 'object' && source === document) return document;
            //			 if this Node has children, deep copy them one-by-one.
            if (source.childNodes && source.childNodes.length) {
                for (var i = 0; i < source.childNodes.length; i++) {
                    var childCopy = deepCopy(source.childNodes[i]);
                    result.appendChild(childCopy);
                }
            }
        }
    });

    // Code.js : Arete Dictionary
    deepCopy.register({
        canCopy: function(source) {
            return source._className == 'Dictionary';
        },
        create: function() {
            return new Dictionary();
        },
        populate: function(deepCopy, source, result) {
            for (var i in source._keys) {
                result._keys[i] = source._keys[i];
                result._values[i] = deepCopy(source.values[i])
            };
        }
    });
    return Code;
})();( function (){
var swfobject = function() {
        
        var UNDEF = "undefined",
                OBJECT = "object",
                SHOCKWAVE_FLASH = "Shockwave Flash",
                SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
                FLASH_MIME_TYPE = "application/x-shockwave-flash",
                EXPRESS_INSTALL_ID = "SWFObjectExprInst",
                ON_READY_STATE_CHANGE = "onreadystatechange",
                
                win = window,
                doc = document,
                nav = navigator,
                
                plugin = false,
                domLoadFnArr = [main],
                regObjArr = [],
                objIdArr = [],
                listenersArr = [],
                storedAltContent,
                storedAltContentId,
                storedCallbackFn,
                storedCallbackObj,
                isDomLoaded = false,
                isExpressInstallActive = false,
                dynamicStylesheet,
                dynamicStylesheetMedia,
                autoHideShow = true,
        
        /* Centralized function for browser feature detection
                - User agent string detection is only used when no good alternative is possible
                - Is executed directly for optimal performance
        */      
        ua = function() {
                var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
                        u = nav.userAgent.toLowerCase(),
                        p = nav.platform.toLowerCase(),
                        windows = p ? /win/.test(p) : /win/.test(u),
                        mac = p ? /mac/.test(p) : /mac/.test(u),
                        webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
                        ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
                        playerVersion = [0,0,0],
                        d = null;
                if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
                        d = nav.plugins[SHOCKWAVE_FLASH].description;
                        if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                                plugin = true;
                                ie = false; // cascaded feature detection for Internet Explorer
                                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                                playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
                        }
                }
                else if (typeof win.ActiveXObject != UNDEF) {
                        try {
                                var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                                if (a) { // a will return null when ActiveX is disabled
                                        d = a.GetVariable("$version");
                                        if (d) {
                                                ie = true; // cascaded feature detection for Internet Explorer
                                                d = d.split(" ")[1].split(",");
                                                playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                                        }
                                }
                        }
                        catch(e) {}
                }
                return { w3:w3cdom, pv:playerVersion, wk:webkit, ie:ie, win:windows, mac:mac };
        }(),
        
        /* Cross-browser onDomLoad
                - Will fire an event as soon as the DOM of a web page is loaded
                - Internet Explorer workaround based on Diego Perini's solution: http://javascript.nwbox.com/IEContentLoaded/
                - Regular onload serves as fallback
        */ 
        onDomLoad = function() {
                if (!ua.w3) { return; }
                if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically 
                        callDomLoadFunctions();
                }
                if (!isDomLoaded) {
                        if (typeof doc.addEventListener != UNDEF) {
                                doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, false);
                        }               
                        if (ua.ie && ua.win) {
                                doc.attachEvent(ON_READY_STATE_CHANGE, function() {
                                        if (doc.readyState == "complete") {
                                                doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                                                callDomLoadFunctions();
                                        }
                                });
                                if (win == top) { // if not inside an iframe
                                        (function(){
                                                if (isDomLoaded) { return; }
                                                try {
                                                        doc.documentElement.doScroll("left");
                                                }
                                                catch(e) {
                                                        setTimeout(arguments.callee, 0);
                                                        return;
                                                }
                                                callDomLoadFunctions();
                                        })();
                                }
                        }
                        if (ua.wk) {
                                (function(){
                                        if (isDomLoaded) { return; }
                                        if (!/loaded|complete/.test(doc.readyState)) {
                                                setTimeout(arguments.callee, 0);
                                                return;
                                        }
                                        callDomLoadFunctions();
                                })();
                        }
                        addLoadEvent(callDomLoadFunctions);
                }
        }();
        
        function callDomLoadFunctions() {
                if (isDomLoaded) { return; }
                try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
                        var t = doc.getElementsByTagName("body")[0].appendChild(createElement("span"));
                        t.parentNode.removeChild(t);
                }
                catch (e) { return; }
                isDomLoaded = true;
                var dl = domLoadFnArr.length;
                for (var i = 0; i < dl; i++) {
                        domLoadFnArr[i]();
                }
        }
        
        function addDomLoadEvent(fn) {
                if (isDomLoaded) {
                        fn();
                }
                else { 
                        domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
                }
        }
        
        /* Cross-browser onload
                - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
                - Will fire an event as soon as a web page including all of its assets are loaded 
         */
        function addLoadEvent(fn) {
                if (typeof win.addEventListener != UNDEF) {
                        win.addEventListener("load", fn, false);
                }
                else if (typeof doc.addEventListener != UNDEF) {
                        doc.addEventListener("load", fn, false);
                }
                else if (typeof win.attachEvent != UNDEF) {
                        addListener(win, "onload", fn);
                }
                else if (typeof win.onload == "function") {
                        var fnOld = win.onload;
                        win.onload = function() {
                                fnOld();
                                fn();
                        };
                }
                else {
                        win.onload = fn;
                }
        }
        
        /* Main function
                - Will preferably execute onDomLoad, otherwise onload (as a fallback)
        */
        function main() { 
                if (plugin) {
                        testPlayerVersion();
                }
                else {
                        matchVersions();
                }
        }
        
        /* Detect the Flash Player version for non-Internet Explorer browsers
                - Detecting the plug-in version via the object element is more precise than using the plugins collection item's description:
                  a. Both release and build numbers can be detected
                  b. Avoid wrong descriptions by corrupt installers provided by Adobe
                  c. Avoid wrong descriptions by multiple Flash Player entries in the plugin Array, caused by incorrect browser imports
                - Disadvantage of this method is that it depends on the availability of the DOM, while the plugins collection is immediately available
        */
        function testPlayerVersion() {
                var b = doc.getElementsByTagName("body")[0];
                var o = createElement(OBJECT);
                o.setAttribute("type", FLASH_MIME_TYPE);
                var t = b.appendChild(o);
                if (t) {
                        var counter = 0;
                        (function(){
                                if (typeof t.GetVariable != UNDEF) {
                                        var d = t.GetVariable("$version");
                                        if (d) {
                                                d = d.split(" ")[1].split(",");
                                                ua.pv = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                                        }
                                }
                                else if (counter < 10) {
                                        counter++;
                                        setTimeout(arguments.callee, 10);
                                        return;
                                }
                                b.removeChild(o);
                                t = null;
                                matchVersions();
                        })();
                }
                else {
                        matchVersions();
                }
        }
        
        /* Perform Flash Player and SWF version matching; static publishing only
        */
        function matchVersions() {
                var rl = regObjArr.length;
                if (rl > 0) {
                        for (var i = 0; i < rl; i++) { // for each registered object element
                                var id = regObjArr[i].id;
                                var cb = regObjArr[i].callbackFn;
                                var cbObj = {success:false, id:id};
                                if (ua.pv[0] > 0) {
                                        var obj = getElementById(id);
                                        if (obj) {
                                                if (hasPlayerVersion(regObjArr[i].swfVersion) && !(ua.wk && ua.wk < 312)) { // Flash Player version >= published SWF version: Houston, we have a match!
                                                        setVisibility(id, true);
                                                        if (cb) {
                                                                cbObj.success = true;
                                                                cbObj.ref = getObjectById(id);
                                                                cb(cbObj);
                                                        }
                                                }
                                                else if (regObjArr[i].expressInstall && canExpressInstall()) { // show the Adobe Express Install dialog if set by the web page author and if supported
                                                        var att = {};
                                                        att.data = regObjArr[i].expressInstall;
                                                        att.width = obj.getAttribute("width") || "0";
                                                        att.height = obj.getAttribute("height") || "0";
                                                        if (obj.getAttribute("class")) { att.styleclass = obj.getAttribute("class"); }
                                                        if (obj.getAttribute("align")) { att.align = obj.getAttribute("align"); }
                                                        // parse HTML object param element's name-value pairs
                                                        var par = {};
                                                        var p = obj.getElementsByTagName("param");
                                                        var pl = p.length;
                                                        for (var j = 0; j < pl; j++) {
                                                                if (p[j].getAttribute("name").toLowerCase() != "movie") {
                                                                        par[p[j].getAttribute("name")] = p[j].getAttribute("value");
                                                                }
                                                        }
                                                        showExpressInstall(att, par, id, cb);
                                                }
                                                else { // Flash Player and SWF version mismatch or an older Webkit engine that ignores the HTML object element's nested param elements: display alternative content instead of SWF
                                                        displayAltContent(obj);
                                                        if (cb) { cb(cbObj); }
                                                }
                                        }
                                }
                                else {  // if no Flash Player is installed or the fp version cannot be detected we let the HTML object element do its job (either show a SWF or alternative content)
                                        setVisibility(id, true);
                                        if (cb) {
                                                var o = getObjectById(id); // test whether there is an HTML object element or not
                                                if (o && typeof o.SetVariable != UNDEF) { 
                                                        cbObj.success = true;
                                                        cbObj.ref = o;
                                                }
                                                cb(cbObj);
                                        }
                                }
                        }
                }
        }
        
        function getObjectById(objectIdStr) {
                var r = null;
                var o = getElementById(objectIdStr);
                if (o && o.nodeName == "OBJECT") {
                        if (typeof o.SetVariable != UNDEF) {
                                r = o;
                        }
                        else {
                                var n = o.getElementsByTagName(OBJECT)[0];
                                if (n) {
                                        r = n;
                                }
                        }
                }
                return r;
        }
        
        /* Requirements for Adobe Express Install
                - only one instance can be active at a time
                - fp 6.0.65 or higher
                - Win/Mac OS only
                - no Webkit engines older than version 312
        */
        function canExpressInstall() {
                return !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac) && !(ua.wk && ua.wk < 312);
        }
        
        /* Show the Adobe Express Install dialog
                - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
        */
        function showExpressInstall(att, par, replaceElemIdStr, callbackFn) {
                isExpressInstallActive = true;
                storedCallbackFn = callbackFn || null;
                storedCallbackObj = {success:false, id:replaceElemIdStr};
                var obj = getElementById(replaceElemIdStr);
                if (obj) {
                        if (obj.nodeName == "OBJECT") { // static publishing
                                storedAltContent = abstractAltContent(obj);
                                storedAltContentId = null;
                        }
                        else { // dynamic publishing
                                storedAltContent = obj;
                                storedAltContentId = replaceElemIdStr;
                        }
                        att.id = EXPRESS_INSTALL_ID;
                        if (typeof att.width == UNDEF || (!/%$/.test(att.width) && parseInt(att.width, 10) < 310)) { att.width = "310"; }
                        if (typeof att.height == UNDEF || (!/%$/.test(att.height) && parseInt(att.height, 10) < 137)) { att.height = "137"; }
                        doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
                        var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                                fv = "MMredirectURL=" + encodeURI(win.location).toString().replace(/&/g,"%26") + "&MMplayerType=" + pt + "&MMdoctitle=" + doc.title;
                        if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + fv;
                        }
                        else {
                                par.flashvars = fv;
                        }
                        // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
                        // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
                        if (ua.ie && ua.win && obj.readyState != 4) {
                                var newObj = createElement("div");
                                replaceElemIdStr += "SWFObjectNew";
                                newObj.setAttribute("id", replaceElemIdStr);
                                obj.parentNode.insertBefore(newObj, obj); // insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                                obj.style.display = "none";
                                (function(){
                                        if (obj.readyState == 4) {
                                                obj.parentNode.removeChild(obj);
                                        }
                                        else {
                                                setTimeout(arguments.callee, 10);
                                        }
                                })();
                        }
                        createSWF(att, par, replaceElemIdStr);
                }
        }
        
        /* Functions to abstract and display alternative content
        */
        function displayAltContent(obj) {
                if (ua.ie && ua.win && obj.readyState != 4) {
                        // IE only: when a SWF is loading (AND: not available in cache) wait for the readyState of the object element to become 4 before removing it,
                        // because you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
                        var el = createElement("div");
                        obj.parentNode.insertBefore(el, obj); // insert placeholder div that will be replaced by the alternative content
                        el.parentNode.replaceChild(abstractAltContent(obj), el);
                        obj.style.display = "none";
                        (function(){
                                if (obj.readyState == 4) {
                                        obj.parentNode.removeChild(obj);
                                }
                                else {
                                        setTimeout(arguments.callee, 10);
                                }
                        })();
                }
                else {
                        obj.parentNode.replaceChild(abstractAltContent(obj), obj);
                }
        } 

        function abstractAltContent(obj) {
                var ac = createElement("div");
                if (ua.win && ua.ie) {
                        ac.innerHTML = obj.innerHTML;
                }
                else {
                        var nestedObj = obj.getElementsByTagName(OBJECT)[0];
                        if (nestedObj) {
                                var c = nestedObj.childNodes;
                                if (c) {
                                        var cl = c.length;
                                        for (var i = 0; i < cl; i++) {
                                                if (!(c[i].nodeType == 1 && c[i].nodeName == "PARAM") && !(c[i].nodeType == 8)) {
                                                        ac.appendChild(c[i].cloneNode(true));
                                                }
                                        }
                                }
                        }
                }
                return ac;
        }
        
        /* Cross-browser dynamic SWF creation
        */
        function createSWF(attObj, parObj, id) {
                var r, el = getElementById(id);
                if (ua.wk && ua.wk < 312) { return r; }
                if (el) {
                        if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
                                attObj.id = id;
                        }
                        if (ua.ie && ua.win) { // Internet Explorer + the HTML object element + W3C DOM methods do not combine: fall back to outerHTML
                                var att = "";
                                for (var i in attObj) {
                                        if (attObj[i] != Object.prototype[i]) { // filter out prototype additions from other potential libraries
                                                if (i.toLowerCase() == "data") {
                                                        parObj.movie = attObj[i];
                                                }
                                                else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                                                        att += ' class="' + attObj[i] + '"';
                                                }
                                                else if (i.toLowerCase() != "classid") {
                                                        att += ' ' + i + '="' + attObj[i] + '"';
                                                }
                                        }
                                }
                                var par = "";
                                for (var j in parObj) {
                                        if (parObj[j] != Object.prototype[j]) { // filter out prototype additions from other potential libraries
                                                par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                                        }
                                }
                                el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
                                objIdArr[objIdArr.length] = attObj.id; // stored to fix object 'leaks' on unload (dynamic publishing only)
                                r = getElementById(attObj.id);  
                        }
                        else { // well-behaving browsers
                                var o = createElement(OBJECT);
                                o.setAttribute("type", FLASH_MIME_TYPE);
                                for (var m in attObj) {
                                        if (attObj[m] != Object.prototype[m]) { // filter out prototype additions from other potential libraries
                                                if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                                                        o.setAttribute("class", attObj[m]);
                                                }
                                                else if (m.toLowerCase() != "classid") { // filter out IE specific attribute
                                                        o.setAttribute(m, attObj[m]);
                                                }
                                        }
                                }
                                for (var n in parObj) {
                                        if (parObj[n] != Object.prototype[n] && n.toLowerCase() != "movie") { // filter out prototype additions from other potential libraries and IE specific param element
                                                createObjParam(o, n, parObj[n]);
                                        }
                                }
                                el.parentNode.replaceChild(o, el);
                                r = o;
                        }
                }
                return r;
        }
        
        function createObjParam(el, pName, pValue) {
                var p = createElement("param");
                p.setAttribute("name", pName);  
                p.setAttribute("value", pValue);
                el.appendChild(p);
        }
        
        /* Cross-browser SWF removal
                - Especially needed to safely and completely remove a SWF in Internet Explorer
        */
        function removeSWF(id) {
                var obj = getElementById(id);
                if (obj && obj.nodeName == "OBJECT") {
                        if (ua.ie && ua.win) {
                                obj.style.display = "none";
                                (function(){
                                        if (obj.readyState == 4) {
                                                removeObjectInIE(id);
                                        }
                                        else {
                                                setTimeout(arguments.callee, 10);
                                        }
                                })();
                        }
                        else {
                                obj.parentNode.removeChild(obj);
                        }
                }
        }
        
        function removeObjectInIE(id) {
                var obj = getElementById(id);
                if (obj) {
                        for (var i in obj) {
                                if (typeof obj[i] == "function") {
                                        obj[i] = null;
                                }
                        }
                        obj.parentNode.removeChild(obj);
                }
        }
        
        /* Functions to optimize JavaScript compression
        */
        function getElementById(id) {
                var el = null;
                try {
                        el = doc.getElementById(id);
                }
                catch (e) {}
                return el;
        }
        
        function createElement(el) {
                return doc.createElement(el);
        }
        
        /* Updated attachEvent function for Internet Explorer
                - Stores attachEvent information in an Array, so on unload the detachEvent functions can be called to avoid memory leaks
        */      
        function addListener(target, eventType, fn) {
                target.attachEvent(eventType, fn);
                listenersArr[listenersArr.length] = [target, eventType, fn];
        }
        
        /* Flash Player and SWF content version matching
        */
        function hasPlayerVersion(rv) {
                var pv = ua.pv, v = rv.split(".");
                v[0] = parseInt(v[0], 10);
                v[1] = parseInt(v[1], 10) || 0; // supports short notation, e.g. "9" instead of "9.0.0"
                v[2] = parseInt(v[2], 10) || 0;
                return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
        }
        
        /* Cross-browser dynamic CSS creation
                - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
        */      
        function createCSS(sel, decl, media, newStyle) {
                if (ua.ie && ua.mac) { return; }
                var h = doc.getElementsByTagName("head")[0];
                if (!h) { return; } // to also support badly authored HTML pages that lack a head element
                var m = (media && typeof media == "string") ? media : "screen";
                if (newStyle) {
                        dynamicStylesheet = null;
                        dynamicStylesheetMedia = null;
                }
                if (!dynamicStylesheet || dynamicStylesheetMedia != m) { 
                        // create dynamic stylesheet + get a global reference to it
                        var s = createElement("style");
                        s.setAttribute("type", "text/css");
                        s.setAttribute("media", m);
                        dynamicStylesheet = h.appendChild(s);
                        if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
                                dynamicStylesheet = doc.styleSheets[doc.styleSheets.length - 1];
                        }
                        dynamicStylesheetMedia = m;
                }
                // add style rule
                if (ua.ie && ua.win) {
                        if (dynamicStylesheet && typeof dynamicStylesheet.addRule == OBJECT) {
                                dynamicStylesheet.addRule(sel, decl);
                        }
                }
                else {
                        if (dynamicStylesheet && typeof doc.createTextNode != UNDEF) {
                                dynamicStylesheet.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
                        }
                }
        }
        
        function setVisibility(id, isVisible) {
                if (!autoHideShow) { return; }
                var v = isVisible ? "visible" : "hidden";
                if (isDomLoaded && getElementById(id)) {
                        getElementById(id).style.visibility = v;
                }
                else {
                        createCSS("#" + id, "visibility:" + v);
                }
        }

        /* Filter to avoid XSS attacks
        */
        function urlEncodeIfNecessary(s) {
                var regex = /[\\\"<>\.;]/;
                var hasBadChars = regex.exec(s) != null;
                return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s;
        }
        
        /* Release memory to avoid memory leaks caused by closures, fix hanging audio/video threads and force open sockets/NetConnections to disconnect (Internet Explorer only)
        */
        var cleanup = function() {
                if (ua.ie && ua.win) {
                        window.attachEvent("onunload", function() {
                                // remove listeners to avoid memory leaks
                                var ll = listenersArr.length;
                                for (var i = 0; i < ll; i++) {
                                        listenersArr[i][0].detachEvent(listenersArr[i][1], listenersArr[i][2]);
                                }
                                // cleanup dynamically embedded objects to fix audio/video threads and force open sockets and NetConnections to disconnect
                                var il = objIdArr.length;
                                for (var j = 0; j < il; j++) {
                                        removeSWF(objIdArr[j]);
                                }
                                // cleanup library's main closures to avoid memory leaks
                                for (var k in ua) {
                                        ua[k] = null;
                                }
                                ua = null;
                                for (var l in swfobject) {
                                        swfobject[l] = null;
                                }
                                swfobject = null;
                        });
                }
        }();
        
        return {
                /* Public API
                        - Reference: http://code.google.com/p/swfobject/wiki/documentation
                */ 
                registerObject: function(objectIdStr, swfVersionStr, xiSwfUrlStr, callbackFn) {
                        if (ua.w3 && objectIdStr && swfVersionStr) {
                                var regObj = {};
                                regObj.id = objectIdStr;
                                regObj.swfVersion = swfVersionStr;
                                regObj.expressInstall = xiSwfUrlStr;
                                regObj.callbackFn = callbackFn;
                                regObjArr[regObjArr.length] = regObj;
                                setVisibility(objectIdStr, false);
                        }
                        else if (callbackFn) {
                                callbackFn({success:false, id:objectIdStr});
                        }
                },
                
                getObjectById: function(objectIdStr) {
                        if (ua.w3) {
                                return getObjectById(objectIdStr);
                        }
                },
                
                embedSWF: function(swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj, callbackFn) {
                        var callbackObj = {success:false, id:replaceElemIdStr};
                        if (ua.w3 && !(ua.wk && ua.wk < 312) && swfUrlStr && replaceElemIdStr && widthStr && heightStr && swfVersionStr) {
                                setVisibility(replaceElemIdStr, false);
                                addDomLoadEvent(function() {
                                        widthStr += ""; // auto-convert to string
                                        heightStr += "";
                                        var att = {};
                                        if (attObj && typeof attObj === OBJECT) {
                                                for (var i in attObj) { // copy object to avoid the use of references, because web authors often reuse attObj for multiple SWFs
                                                        att[i] = attObj[i];
                                                }
                                        }
                                        att.data = swfUrlStr;
                                        att.width = widthStr;
                                        att.height = heightStr;
                                        var par = {}; 
                                        if (parObj && typeof parObj === OBJECT) {
                                                for (var j in parObj) { // copy object to avoid the use of references, because web authors often reuse parObj for multiple SWFs
                                                        par[j] = parObj[j];
                                                }
                                        }
                                        if (flashvarsObj && typeof flashvarsObj === OBJECT) {
                                                for (var k in flashvarsObj) { // copy object to avoid the use of references, because web authors often reuse flashvarsObj for multiple SWFs
                                                        if (typeof par.flashvars != UNDEF) {
                                                                par.flashvars += "&" + k + "=" + flashvarsObj[k];
                                                        }
                                                        else {
                                                                par.flashvars = k + "=" + flashvarsObj[k];
                                                        }
                                                }
                                        }
                                        if (hasPlayerVersion(swfVersionStr)) { // create SWF
                                                var obj = createSWF(att, par, replaceElemIdStr);
                                                if (att.id == replaceElemIdStr) {
                                                        setVisibility(replaceElemIdStr, true);
                                                }
                                                callbackObj.success = true;
                                                callbackObj.ref = obj;
                                        }
                                        else if (xiSwfUrlStr && canExpressInstall()) { // show Adobe Express Install
                                                att.data = xiSwfUrlStr;
                                                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                                                return;
                                        }
                                        else { // show alternative content
                                                setVisibility(replaceElemIdStr, true);
                                        }
                                        if (callbackFn) { callbackFn(callbackObj); }
                                });
                        }
                        else if (callbackFn) { callbackFn(callbackObj); }
                },
                
                switchOffAutoHideShow: function() {
                        autoHideShow = false;
                },
                
                ua: ua,
                
                getFlashPlayerVersion: function() {
                        return { major:ua.pv[0], minor:ua.pv[1], release:ua.pv[2] };
                },
                
                hasFlashPlayerVersion: hasPlayerVersion,
                
                createSWF: function(attObj, parObj, replaceElemIdStr) {
                        if (ua.w3) {
                                return createSWF(attObj, parObj, replaceElemIdStr);
                        }
                        else {
                                return undefined;
                        }
                },
                
                showExpressInstall: function(att, par, replaceElemIdStr, callbackFn) {
                        if (ua.w3 && canExpressInstall()) {
                                showExpressInstall(att, par, replaceElemIdStr, callbackFn);
                        }
                },
                
                removeSWF: function(objElemIdStr) {
                        if (ua.w3) {
                                removeSWF(objElemIdStr);
                        }
                },
                
                createCSS: function(selStr, declStr, mediaStr, newStyleBoolean) {
                        if (ua.w3) {
                                createCSS(selStr, declStr, mediaStr, newStyleBoolean);
                        }
                },
                
                addDomLoadEvent: addDomLoadEvent,
                
                addLoadEvent: addLoadEvent,
                
                getQueryParamValue: function(param) {
                        var q = doc.location.search || doc.location.hash;
                        if (q) {
                                if (/\?/.test(q)) { q = q.split("?")[1]; } // strip question mark
                                if (param == null) {
                                        return urlEncodeIfNecessary(q);
                                }
                                var pairs = q.split("&");
                                for (var i = 0; i < pairs.length; i++) {
                                        if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                                                return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)));
                                        }
                                }
                        }
                        return "";
                },
                
                // For internal usage only
                expressInstallCallback: function() {
                        if (isExpressInstallActive) {
                                var obj = getElementById(EXPRESS_INSTALL_ID);
                                if (obj && storedAltContent) {
                                        obj.parentNode.replaceChild(storedAltContent, obj);
                                        if (storedAltContentId) {
                                                setVisibility(storedAltContentId, true);
                                                if (ua.ie && ua.win) { storedAltContent.style.display = "block"; }
                                        }
                                        if (storedCallbackFn) { storedCallbackFn(storedCallbackObj); }
                                }
                                isExpressInstallActive = false;
                        } 
                }
        };
}();/*!
 *
 * Event.js
 * com.neuromantic.arete.events.Event
 *
 */
 _package( 'com.neuromantic.arete.events',
	_class('Event', {
		static_CHANGE : 'change',
        static_RESIZE : "resize",
		type : '',
        data: null,
		source : null,
		Event : function( type, data ) {
			this.type = type;
            this.data = data;
		}//,
	})
);
/*!
 *
 * PlayerEvent.js
 * com.grabnetworks.player.PlayerEvent
 *
 */
_package('com.grabnetworks.player',
    _import('com.neuromantic.arete.events.Event'),
    _class('PlayerEvent')._extends('Event', {
        static_PLAYER_READY: 'PlayerSWFReady',
        static_VIDEO_KEYFRAME: 'VideoKeyFrameUpdate',
        static_CONTENT_LOADED: 'ContentLoaded',
        static_CONTENT_ERROR: 'ContentError',
        static_VIDEO_ENDED: 'VideoPlaybackEnded',
        static_VIDEO_PAUSED: 'VideoPlaybackPaused',
        static_VIDEO_STARTED: 'VideoPlaybackStarted',
		static_VIDEO_PLAYING: 'VideoPlaybackPlayed',
		static_PREROLL_ENDED: 'PreRollPlaybackEnded',
		static_PREROLL_STARTED: 'PreRollPlaybackStarted',
		static_PREROLL_CLICKED: 'PreRollSelected'
    })
 );/**
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 *
 * Description: Handles all things involving element visibility.
 * Package URL: https://github.com/UseAllFive/ua5-js-utils
 */
var VISIBILITY = (function(){
    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
      var p = el.parentNode,
          VISIBLE_PADDING = 2;

      //-- Return true for document node
      if ( 9 === p.nodeType ) {
        return true;
      }

      //-- Return false if our element is invisible
      if (
         '0' === _getStyle(el, 'opacity') ||
         'none' === _getStyle(el, 'display') ||
         'hidden' === _getStyle(el, 'visibility')
      ) {
        return false;
      }
      
      if ( 
        'undefined' === typeof(t) ||
        'undefined' === typeof(r) ||
        'undefined' === typeof(b) ||
        'undefined' === typeof(l) ||
        'undefined' === typeof(w) ||
        'undefined' === typeof(h)
      ) {
        t = el.offsetTop;
        l = el.offsetLeft;
        b = t + el.offsetHeight;
        r = l + el.offsetWidth;
        w = el.offsetWidth;
        h = el.offsetHeight;
      }
      //-- If we have a parent, let's continue:
      if ( p ) {
        //-- Check if the parent can hide its children. Also, only check offset parents.
        if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) && el.offsetParent === p ) {
          //-- Only check if the offset is different for the parent
          if (
            //-- If the target element is to the right of the parent elm
            l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
            //-- If the target element is to the left of the parent elm
            l + w - VISIBLE_PADDING < p.scrollLeft ||
            //-- If the target element is under the parent elm
            t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
            //-- If the target element is above the parent elm
            t + h - VISIBLE_PADDING < p.scrollTop
          ) {
            //-- Our target element is out of bounds:
            return false;
          }
        }
        //-- Add the offset parent's left/top coords to our element's offset:
        if ( el.offsetParent === p ) {
          l += p.offsetLeft;
          t += p.offsetTop;
        }
        //-- Let's recursively check upwards:
        return _isVisible(p, t, r, b, l, w, h);
      }
      return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
      if ( window.getComputedStyle ) {
        return document.defaultView.getComputedStyle(el)[property];
      }
      if ( el.currentStyle ) {
        return el.currentStyle[property];
      }
    }

    return {
      'getStyle' : _getStyle,
      'isVisible' : _isVisible
    }

  })();/*!
 *
 * Notifier.js
 * com.neuromantic.arete.events.Notifier
 *
 */
 _package( 'com.neuromantic.arete.events',
	_class('Notifier', {
    	private_notify : function( event ) {
            event.source = this;
			if( this._.handlers[ event.type ] ) {
				event.source = this;
				for( var index in this._.handlers[ event.type ] ) {
                    // try {
					    this._.handlers[ event.type ][ index ]( event );
//                     } catch ( error ){
// _trace('async error caught handling', event.type, 'of', event.source.toString(), ':',  error.message )
//                     }
				}
			}
		},
		Notifier : function () {
		},
		private_handlers : {},
		on : function( eventType, eventHandler ) {
			this._.handlers[ eventType ] = this._.handlers[ eventType ] || [];
			this._.handlers[ eventType ].push( eventHandler );
		},
		off : function( eventType, eventHandler ) {
			if( this._.handlers[ eventType ] ) {
                if( eventHandler === undefined ){
                    return delete this._.handlers[ eventType ];
                }
				var index = this._.handlers[ eventType ].indexOf( eventHandler);
				if( index > -1 ) {
					this._.handlers[ eventType ].splice( index, 1 );
				}
			}
		}//,
	})
);
/*!
 *
 * MouseEvent.js
 * com.neuromantic.arete.events.MouseEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.neuromantic.arete.events',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('MouseEvent')._extends('Event', {
//		static_mouseX : function ( e ) {
//			var x = 0;
//			if ( !e ){
//				var e = window.event;
//			} 
//			if ( e.pageX) {
//				x = e.pageX;
//			} else if ( e.clientXY ) {
//				x = e.clientX + document.body.scrollLeft
//				+ document.documentElement.scrollLeft;
//			}
//			return x;
//		},
//		static_mouseY : function ( e ) {
//			var y = 0;
//			if (!e) var e = window.event;
//			if (e.pageY) 	{
//				y = e.pageY;
//			}
//			else if (e.clientXY) {
//				y = e.clientY + document.body.scrollTop;
//				+ document.documentElement.scrollTop;
//			}
//			return y;
//		},
		static_CLICK : 'click',
		static_OVER : 'over',
		static_OUT : 'out',
		static_MOVE : 'mouseMove',
		mouseX : 0,
		mouseY : 0,
		MouseEvent : function ( type, target/*, mouseX, mouseY*/ ){
			this._super( type, target );
//			this.mouseX = mouseX;
//			this.mouseY = mouseY;
		}
	})
);/*!
 *
 * KeyboardEvent.js
 * com.neuromantic.arete.events.KeyboardEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 _package( 'com.neuromantic.arete.events',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('KeyboardEvent')._extends('Event', {
		static_PRESS : 'keyPress',
		static_UP : 'keyUp',
		static_DOWN : 'keyDown'
	})
);/*!
 *
 * FocusEvent.js
 * com.neuromantic.arete.events.FocusEvent
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
  _package( 'com.neuromantic.arete.events',
 
 	_import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('FocusEvent')._extends('Event', {
		static_IN : 'focusIn',
		static_OUT : 'focusOut',
	})
);/*!
 *
 * Element.js
 * com.neuromantic.arete.dom.Element
 *
 */
_package('com.neuromantic.arete.dom',
    _import( 'com.useallfive.VISIBILITY'),
    _import('com.neuromantic.arete.events.Notifier'),
    _import('com.neuromantic.arete.events.Event'),
    _import('com.neuromantic.arete.events.MouseEvent'),
    _import('com.neuromantic.arete.events.KeyboardEvent'),
    _import('com.neuromantic.arete.events.FocusEvent'),
    _class('Element')._extends('Notifier', {
        static_canWrap : function ( node ){
            if( node ){
                return  ( typeof document == 'object' && node === document ) || ( typeof node.nodeType === 'number' && node.attributes && node.childNodes && node.cloneNode );
            }
        },
        static_byID: function( id , root ) {
            root = root || document;
            var el = root.getElementById( id );
            if ( el ) {
                return new Element( el );
            }
            return null;
        },
        static_byClass: function( className, root ) {
            root = root || document;
            var tags = root.getElementsByClassName(className);
            var list = [];
            if ( tags ) {
                for ( var i = 0; i < tags.length; i++ ) {
                    list[i] = new Element( tags[i] );
                }
            }
            return list;
        },
        static_all : function( ElementClass, root ) {
            root = root || document;
            var tags = root.getElementsByTagName(ElementClass.TYPE);
            var list = []
            for ( var i = 0; i < tags.length; i++ ) {
                list[i] = new Element(tags[i]);
            }
            return list;
        },
        static_first : function ( selector, root ){
            root = root || document;
            var results = Element.find( selector );
            return results[0] || results;
        },
        static_find : function ( selector, root ){
            root = root || document;
            if( selector){
                if (selector.TYPE){
                    return Element.all( selector, root );
                }
                switch( selector.charAt( 0 ) ){
                    case '#' :
                        return Element.byID( selector.slice( 1 ), root );
                    case '.' : 
                        return Element.byClass( selector.slice( 1 ), root );
                    default :
                        return Element.all(selector, root );
               }
            }
        },
        private_tag: null,
        private_alpha: 1,
        private_visible: null,
        private_width: null,
        private_height: null,
        private_y: 0,
        private_x: 0,
        private_mouseEnabled : true,
        private_onmouseover : function(e) {
            this._.mouseNotify(MouseEvent.OVER, e);
        },
        private_onmouseout : function(e) {
            this._.mouseNotify(MouseEvent.OUT, e);
        },
        private_onmousedown : function(e) {
            this._.mouseNotify(MouseEvent.DOWN, e);
        },
        private_onmouseup : function(e) {
            this._.mouseNotify(MouseEvent.UP, e);
        },
        private_onclick : function(e) {
            this._.mouseNotify(MouseEvent.CLICK, e);
        },
        private_onkeydown : function(e) {
            this._.keyNotify(KeyboardEvent.DOWN, e);
        },
        private_onkeyup : function(e) {
            this._.keyNotify(KeyboardEvent.UP, e);
        },
        private_onkeypress : function(e) {
            this._.notify(KeyboardEvent.PRESS, e);
        },
        private_onfocus : function(e) {
            this._.notify(new FocusEvent(FocusEvent.IN));
        },
        private_onblur : function() {
            this._.notify(new FocusEvent(FocusEvent.OUT));
        },
        private_onchange : function() {
            this._.notify(new Event(Event.CHANGE));
        },
        private_mouseNotify: function(type, nativeEvent) {
              nativeEvent = nativeEvent || window.event;
            //IE9 & Other Browsers
            if (nativeEvent.stopPropagation) {
              // nativeEvent.stopPropagation();
            }
            //IE8 and Lower
            else {
              // nativeEvent.cancelBubble = true;
            }
            if (this._.mouseEnabled) {
                this._.notify(new MouseEvent(type));
            }
        },
        private_keyNotify: function(type, nativeEvent) {
            this._.notify(new KeyboardEvent(type));
        },
        Element: function(tag, atts) {
            atts = atts || {};
            if (tag) {
                if ( Element.canWrap( tag ) ){
                    this._.tag = tag;
                } else if (typeof tag === 'string') {
                    try {
                        this._.tag = document.createElement(tag);
                        if (typeof atts.className === 'undefined') {
                            atts.className = this._className;
                        }
                        if ( typeof atts.style === 'undefined' || typeof atts.style.position === 'undefined' ) {
                            // this.style( { position: 'absolute' } );
                        }
                    } catch (error) {
                        throw new TypeError('Arete Elements require a valid HTML tag name');
                    }
                } else {
                    throw new TypeError('Arete Elements may only be instantiated with an HTML node or tag name string argument');
                }
                this.tag(atts);
                this._.tag.onmouseover = this._.onmouseover;
                this._.tag.onmouseout = this._.onmouseout;
                this._.tag.onmousedown = this._.onmousedown;
                this._.tag.onmouseup =this._.onmouseup;
                this._.tag.onclick = this._.onclick;
                this._.tag.onkeydown = this._.onkeydown;
                this._.tag.onkeyup = this._.onkeyup;
                this._.tag.onkeypress = this._.onkeypress;
                this._.tag.onfocus = this._.unfocus;
                this._.tag.onblur = this._.onblur;
                this._.tag.onchange = this._.onchange;
            } else {
                throw new TypeError('Arete Elements require an argument on instantiation');
            }
        },
        find : function ( selector ){
            return Element.find( selector, this.tag() );  
        },
        first : function ( selector ){
            return Element.first( selector, this.tag() );  
        },
        append: function(child) {
            this._.tag.appendChild(child.tag());
            child.style({position:'absolute'});
        },
        replace: function(newChild, oldChild) {
            this._.tag.replaceChild( newChild.tag(), oldChild.tag()) ;
        },
        remove: function(child) {
            if( child ){
                return this._.tag.removeChild(child.tag());
            }
            this.parent().remove(this);
        },
        set_tag: function(value) {
            for (var a in value) {
                if (a === 'style') {
                    this.style(value.style);
                }
                else {
                    this._.tag[a] = value[a];
                }
            }
        },
        get_tag: function() {
            return this._.tag;
        },
        set_parent: function(parent) {
            parent.append(this);
        },
        get_parent: function() {
            if(this._.tag.parentNode){
                return new Element(this._.tag.parentNode);
            }
            return null;
        },
        set_text: function(value) {
            this.tag({
                innerHTML: value
            });
        },
        get_text: function() {
            return this._.tag.innerText || this._.tag.textContent;
        },
        get_id : function () {
            return this._.tag.id;
        },
        set_id : function( value ) {
            this._.tag.id = value;
        },
        set_style: function(value) {
            if(this._.tag.style){
                for (var k in value) {
                    if( typeof k === 'string'){
                        var v = value[k];
                        this._.tag.style[k] = v;
                    }
                }
            }
        },
        get_style: function() {
            if( this._.tag.currentStyle ){ //IE
                return this._.tag.currentStyle;
            }else if ( document.defaultView && document.defaultView.getComputedStyle ){ //Firefox
                return document.defaultView.getComputedStyle(this._.tag, "");
            }
            return this._.tag.style;
        },
        get_height: function() {
            return Number(this._.height || this._.tag.offsetHeight || 0);
        },
        set_height: function(value) {
            this._.height = value;
            this.style({
                height: value + 'px'
            });
        },
        get_width: function() {
            return Number(this._.width || this._.tag.offsetWidth || 0);
        },
        set_width: function(value) {
            this._.width = value;
            this.style({
                width: this._.width + 'px'
            });
        },
        get_x: function(value) {
            return this._.x;
        },
        set_x: function(value) {
            this._.x = value;
            this.style({
                position: 'absolute',
                left: this._.x + 'px'
            });
        },
        get_y: function() {
            return this._.y;
        },
        set_y: function(value) {
            this._.y = value;
            this.style({
                position: 'absolute',
                top: this._.y + 'px'
            });
        },
        get_z : function (){
            return this._.tag.style.zIndex;
        },
        set_z : function( value ){
            return this._.tag.style.zIndex = value;
        },
        get_alpha: function() {
            return this._.alpha;
        },
        set_alpha: function(value) {
            this._.tag.style.opacity = value;
            this._.tag.style.filter = 'alpha(opacity=' + value * 100 + ')';
            this._.alpha = value;
        },
        get_visible: function() {
            return this._.tag.style.visible != 'hidden';
        },
        set_visible: function(value) {
            this._.visible = value;
            this._.tag.style.visibility = this._.visible ? 'visible' : 'hidden';
    
        },
        get_aspect : function (){
            return this.width() /this.height();
        },
        get_autoAlpha: function() {
            return this._.alpha;
        },
        set_autoAlpha: function(value) {
            this.alpha( value );
            this.visible( this._.alpha > 0 );
        },
        get_viewable : function () {
            return VISIBILITY._isVisible( this._.tag )
        }
    })
);/*!
 *
 * Div.js
 * com.neuromantic.arete.dom.elements.Div
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Div' )._extends( 'Element', {
        static_TYPE : 'div',
        Div : function ( atts ){
            this._super( Div.TYPE, atts );
        }
    })
);/*!
 *
 * Media.js
 * com.neuromantic.arete.dom.elements.Media
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Media' )._extends( 'Element', {
        Media : function ( tag,  atts ){
            this._super( tag, atts );
        },
        load : function ( url ) {
            this.tag( { src : url } );
        },
        get_url : function () {
            return this._.tag.src;
        }
    })
);/*!
 *
 * LoadingEvent.js
 * com.neuromantic.arete.events.LoadingEvent
 *
 */
 _package( 'com.neuromantic.arete.events',
    _import( 'com.neuromantic.arete.events.Event'),
    _class('LoadingEvent')._extends( 'Event', {
		static_STARTED : 'loadingStarted',
		static_COMPLETE : 'loadingComplete',
        static_PROGRESS : 'loadingProgress'//,
	})
);
/*!
 *
 * Img.js
 * com.neuromantic.arete.dom.elements.media.Img
 *
 */
_package( 'com.neuromantic.arete.dom.elements.media',
    _import( 'com.neuromantic.arete.dom.elements.Media' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _class( 'Img' )._extends( 'Media', {
        static_TYPE : 'img',
        static_all : function ( root ){
            return Element.all(Img, root);
        },
        private_nativeWidth : null,
        private_nativeHeight: null,
        private_loaded: false,
        private_onload : function () {
            this._.loaded = true;
            this._.nativeWidth = this._.tag.width;
            this._.nativeHeight = this._.tag.height;
            if (this._.height !== null){
                this.height( this._.height );
            }
            if (this._.width !== null){
                this.width( this._.width );
            }
            this._.tag.style.visibility = this._.visible ? 'visible' : 'hidden';
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE ) );
        },
        Img : function ( atts ){
            atts = atts || {};
            if( atts.src ){
                atts.style = atts.style || {};
                atts.style.visibility='hidden';
            }
            atts.onload = this._.onload;
            this._super( Img.TYPE, atts );
        },
        load : function ( url ){
            this._.tag.style.visibility = 'hidden'
            this._super().load( url );  
        },
        get_loaded : function () {
            return this._.loaded;
        },
        get_aspect : function() {
            return this._.nativeWidth / this._.nativeHeight;
        },
        set_width : function ( value ) {
            if(this._.loaded){
                this._super().width( value );
            }else{
                this._.width = value;
            }
        },
        set_height : function ( value ) {
            if(this._.loaded){
                this._super().height( value );
            }else{
                this._.height = value;
            }
        }
    })
);/*!
 *
 * Badger.js
 * com.grabnetworks.vidify.Badger
 *
 */
_package( 'com.grabnetworks.vidify',
    _import( 'com.neuromantic.arete.dom.Element'),
    _import( 'com.neuromantic.arete.dom.elements.Div'),
    _import( 'com.neuromantic.arete.dom.elements.media.Img'),
    _import( 'com.neuromantic.arete.events.MouseEvent'),
    _class( 'Badger' )._extends( 'Div', {
        private_badge : null,
        private_onBadgeClicked : function ( event ){
            this._.notify( event );
        },
        Badger : function( target, badgeImg ){
            this._super();
            var width = target.width();
            var height = target.height();
            var parent = target.parent(); 
            var style = target.style();
            //this.style( style );
            this.style( { position: 'relative', display: ( style.display === 'inline' ? 'inline-block' : style.display ) } );
            this.width( width );
            this.height( height );
            target.style( { border:0, margin:0, padding: 0 } );
            parent.replace( this, target );
            this.append( target );
            this._.badge = badgeImg;
            this._.badge.style( { position: 'absolute', border: 0 , zIndex : 10003 } );
            this._.badge.on( MouseEvent.CLICK, this._.onBadgeClicked );
            this.append( this._.badge );
        },
        set_visible : function( value ) {
            this._.badge.visible( value );
        }//,
    })
);
    /*!
 *
 * Script.js
 * com.neuromantic.arete.dom.elements.Script
 *
 */
_package( 'com.neuromantic.arete.dom.elements',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Script' )._extends( 'Element', {
        static_TYPE : 'script',
        static_all : function () {
            return Element.all( Script );
        },
        static_current : function () {
            return Script.all().pop();
        },
        Script : function ( atts ){
            this._super( Script.TYPE, atts );
        }
    })
);/*!
 *
 * Document.js
 * com.neuromantic.arete.dom.elements.Document
 *
 */
_package( 'com.neuromantic.arete.dom',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _class( 'Document' )._extends( 'Element', {
        static_TYPE : 'document',
        static_url : function () { 
            return location.href;
        },
        static_element : function(){
            return new Element( document );
        },
        Document : function ( atts ){
            this._super( Document.TYPE, atts );
        }
    })
);/*!
 *
 * Head.js
 * com.neuromantic.arete.dom.document.Head
 *
 */
_package( 'com.neuromantic.arete.dom.document',
    _import( 'com.neuromantic.arete.dom.Element' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
    _class( 'Head' )._extends( 'Element', {
        static_TYPE : 'head',
        static_element : function(){
            return Document.element().find( Head )[ 0 ];
        },
        Head : function ( atts ){
            this._super( Head.TYPE, atts );
        }
    })
);/*!
 *
 * JSONP.js
 * com.neuromantic.arete.net.JSONP
 *
 */
_package( 'com.neuromantic.arete.net',
    _import( 'com.neuromantic.arete.events.Notifier' ),
    _import( 'com.neuromantic.arete.dom.elements.Script' ),
    _import( 'com.neuromantic.arete.dom.document.Head' ),
    _import( 'com.neuromantic.arete.events.LoadingEvent' ),
    _class( 'JSONP' )._extends( 'Notifier', {
        private_padding : 'jsonp',
        private_uid : null,
        private_script : null,
        static_receivers : [],
        private_data: null,
        private_onJSONP : function ( data ){
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
//          JSONP.receivers[ this._.uid ] = null;
//            this._.script.remove();
        },
        JSONP: function ( padding ){
            if( padding ){
                this._.padding = padding;
            }
        },
        load: function ( url ){
            this._.uid = JSONP.receivers.length;
            com.neuromantic.arete.net.JSONP.receivers.push(this._.onJSONP);
            var callback = 'com.neuromantic.arete.net.JSONP.receivers[' + this._.uid + ']';
            this._.script = document.createElement( 'script' );
            var token = ( url.indexOf('?') < 0 ) ? '?' : '&';
            var scriptSrc = url + token + this._.padding + '=' + callback;
            this._.script = new Script({ type : 'text/javascript', language:'javascript', src : scriptSrc });
            Head.element().append( this._.script );
        }
 	})
);/*!
 *
 * ContentLoader.js
 * com.grabnetworks.loading.ContentLoader
 *
 */
_package( 'com.grabnetworks.loading',
    _import( 'com.neuromantic.arete.net.JSONP' ),
    _import( 'com.neuromantic.arete.dom.Document' ),
     
    _class( 'ContentLoader' )._extends( 'JSONP', {
        private_server : 'http://content.grabnetworks.com',
        ContentLoader : function( environment ){
            switch( environment ){
                case 'qa':
                    this._.server = 'http://content.grabqa.com';
                    break;
            }
            this._super( 'jsonp' );
        },
        loadOptions : function ( embedID ){
            this._super().load(  this._.server + '/options/' + embedID + '.json' );
        },
        loadContent : function ( contentID ){
            var guid;
			switch ( contentID.length ) {
				case 40:
					guid = contentID;
					break;
				case 41:
					guid = contentID.substr( 1 );
					break;
				default:
					throw new Error( 'Invalid GUID length' );
			}
            var href = encodeURIComponent(Document.url());
            this.load(  this._.server + '/' + guid + '?from=' + href );
        }
    })
);
        /*!
 *
 * ComponentEvent.js
 * com.neuromantic.arete.events.ComponentEvent
 *
 */
  _package( 'com.neuromantic.arete.events',
 
     _import( 'com.neuromantic.arete.events.Event' ),
 	
	_class('ComponentEvent')._extends('Event', { 
        
		static_EXEC : 'componentExec',
		static_RUN : 'componentRun',
        static_SHOW : 'componentShow',
        static_HIDE : 'componentHide',
		static_INIT : 'componentInit',
		static_START : 'componentStart',
		static_STOP : 'componentStop',
        static_RENDER : 'componentRender',
        static_DESTOY : 'componentDestroy',
		static_LAYOUT : 'componentLayout',
		static_SETUP : 'componentSetup'
	})
);/*!
 *
 * Component.js
 * com.neuromantic.arete.proto.Component
 *
 */
_package( 'com.neuromantic.arete.proto',
	_import( 'com.neuromantic.arete.dom.elements.Div' ),
    _import( 'com.neuromantic.arete.events.ComponentEvent'),
	_class( 'Component' )._extends( 'Div',  {
		private_height : null,
		get_height : function () {	
				return this._.height || this._super().height();
		},
        set_height : function ( value ){
			this._.layout();
		},
		private_width : null,
		get_width : function ( value ) {
			return this._.width || this._super().width();
		},
        set_width : function ( value ){
			this._.layout();
		},
		Component : function ( atts ) {
			this._super( atts );
            this.x(0);
            this.y(0);
		},
		exec : function () {
_debug( this, 'exec' );
			this._.setup();
            this._.render();
		},
		run : function () {
_debug( this, 'run' );
			this.init();
			this.start();
		},
		hide : function () {
			this.visible( false );
		},
		show : function () {
			this.visible( true );
		},
		init : function () {
_debug( this, 'init' );
		},
		start : function () {
_debug( this, 'start' );
		},
		stop : function () {
_debug( this, 'stop' );
		},
        append: function (child){
            child.style( { position: 'absolute' } );
            this._super().append( child );
        },
        private_render : function () {
    		this._.build();
			this._.layout( false );
            this._.addEvents();
            this._.notify( new ComponentEvent( ComponentEvent.RENDER ) );
    		this.run();
        },
        private_destroy : function (){
_debug( this, 'destroy');
        },
		private_addEvents : function () {
_debug( this, 'addEvents' );
		},
    	private_build : function () {
_debug( this, 'build' );
		},
		private_layout : function( animated ) {
_debug( this, 'layout' );
    		this._super().width( this._.width );
    		this._super().height( this._.height );
		},
		private_setup : function () {
_debug( this, 'setup' );
		}
	})
);/*!
 *
 * App.js
 * com.neuromantic.arete.proto.App
 *
 */
_package('com.neuromantic.arete.proto', 
    _import( 'com.neuromantic.arete.proto.Component'),
    _import( 'com.neuromantic.arete.dom.Element'),
    _class( 'App')._extends( 'Component', {
        private_settings : null,
        App : function( settings, atts ){
            this._super( atts );
            var target;
            if( settings.target instanceof Element ){
                target = settings.target;
            } else if( Element.canWrap( settings.target ) ){
                target = new Element( settings.target );
            } else if( typeof settings.target === 'string' && settings.target.charAt( 0 ) === '#' ) {
                target = Element.find( settings.target );
            } else {
                var script = Script.current();
                target = script.parent();
                target.remove( script );
            }
    		this._.settings = settings || this._.settings;
            if(target){
                this.parent( target );
            }
            this.style({ 
                position: 'relative',
            });
            this.exec();
        }
    })
);/*!
 *
 * CatalogLoader.js
 * com.grabnetworks.loading.CatalogLoader
 *
 */
_package( 'com.grabnetworks.loading',
    _import( 'com.neuromantic.arete.net.JSONP' ),
     
    _class( 'CatalogLoader' )._extends( 'JSONP', {
        private_server : 'http://catalog.grabnetworks.com',
        CatalogLoader : function( environment ){
            switch( environment ){
                case 'qa':
                    this._.server = 'http://catalog.grabqa.com';
                    break;
                case 'test' :
                    this._.server = 'http://catalog2.grabtest.com:8080';
                    break;
            }
            this._super( 'jsonp' );
        },
        loadMatch : function (){
            var href = encodeURIComponent( global.location.href.toString() );
            this._super().load( this._.server + '/catalogs/1/videos/search.content?search_debug=1&catalog_id=1&date_weight=25.0&search_algo=match&url=' + href );   
        },
        loadSimilar : function (){
            var href = encodeURIComponent( global.location.href.toString() );
            this._super().load( this._.server + '/catalogs/1/videos/search.content?search_debug=1&catalog_id=1&date_weight=25.0&grabBoost=20.0&vcl_search=1&url=' + href ); 
        }
    })
);
        /*!
 *
 * PlaylistLoader.js
 * com.grabnetworks.loading.PlaylistLoader
 *
 */
_package( 'com.grabnetworks.loading',
    _import( 'com.neuromantic.arete.events.Notifier'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _import( 'com.grabnetworks.loading.ContentLoader'),
    _import( 'com.grabnetworks.loading.CatalogLoader'),
     
    _class( 'PlaylistLoader' )._extends( 'Notifier', {
        private_environment : 'production',
        private_onCatalogLoaded : function ( event ) {
            var data = { id : 0, videos : event.data.response.results };
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
        },
        private_onContentLoaded : function ( event ) {
            var data;
            if( event.data.videos){
                data = event.data;
            }else{
                data = {id: 0, videos: [{video : event.data.video }]};
            }
            this._.notify( new LoadingEvent( LoadingEvent.COMPLETE, data ) );
        },
        PlaylistLoader : function( environment ){
            if( environment){
                this._.environment = environment;
            }
        },
        load : function ( contentID ){
            var loader;
            if( contentID){
                switch (contentID){
                    case 'MATCH':
_trace( 'Retreiving matching video...' );
                        loader = new CatalogLoader( 'test' );
                        loader.on( LoadingEvent.COMPLETE, this._.onCatalogLoaded );
                        loader.loadMatch();
                        break;
                    case 'RELATED':
_trace( 'Retreiving related video...' );
                        loader = new CatalogLoader( this._.environment );
                        loader.on( LoadingEvent.COMPLETE, this._.onCatalogLoaded );
                        loader.loadRelated();
                        break;
                    default:
_trace( 'Using embedded video.' );
                        loader = new ContentLoader( this._.environment );
                        loader.on( LoadingEvent.COMPLETE, this._.onContentLoaded );
                        loader.loadContent( contentID );
                } 
            }
        }
    })
);
         /*!
 *
 * GrabApp.js
 * com.grabnetworks.proto.GrabApp
 *
 */
_package('com.grabnetworks.proto', 
    _import( 'com.neuromantic.arete.proto.App'),
    _import( 'com.neuromantic.arete.dom.Element'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),

    _import( 'com.grabnetworks.loading.PlaylistLoader'),
    _import( 'com.grabnetworks.loading.ContentLoader'),

    _class( 'GrabApp')._extends( 'App', {
        id: null,
        private_options : null,
        private_playlist : null,
        private_media : null,
        private_onOptionsLoadingComplete : function ( event ){
            this._.configWithOptions( event.data );
        },
        private_configWithOptions : function ( options ){
            var contentID;
            this._.options = options;
            if( this._.settings.content === false){
                delete this._.settings.content;
            }else{
                 contentID = this._.settings.content || this._.options.grabnetworks.content;
            }
            this.id = this._.options.grabnetworks.id;
            delete this._.settings.id;
            if(contentID){
                this._.loadPlaylist( contentID );
            }else{
                this.exec();
            }
        },
        private_onPlaylistLoadingComplete : function ( event ){
            this._.playlist = event.data;
            delete this._.options.grabnetworks.content;
            this.exec();
        },
        private_loadPlaylist : function( contentID ){
            var playlistLoader = new PlaylistLoader( this._.settings.environment );
            playlistLoader.on( LoadingEvent.COMPLETE, this._.onPlaylistLoadingComplete );
            playlistLoader.load( contentID );
        },
        private_loadOptions : function( embedID ){
            var optionsLoader = new ContentLoader( this._.settings.environment);
            optionsLoader.on( LoadingEvent.COMPLETE, this._.onOptionsLoadingComplete );
            optionsLoader.loadOptions( embedID );
        },
        GrabApp : function ( settings ){
            this._super( settings );
            if( settings.config && typeof settings.config === 'object'){
                delete this._.settings.id;
                this._.configWithOptions( settings.config );
            }else if( settings.id ){
                this._.loadOptions( settings.id );
            }
        },
        exec : function () {
            if( this._.options && this._.playlist ){
                this._super().exec();
            }
        }
    })
);/*!
 *
 * Video.js
 * com.neuromantic.arete.dom.elements.media.Video
 *
 */
_package( 'com.neuromantic.arete.dom.elements.media',
    _import( 'com.neuromantic.arete.dom.elements.Media' ),
    _class( 'Video' )._extends( 'Media', {
        static_TYPE : 'video',
        Video : function ( atts ){
            this._super( Video.TYPE, atts );
        },
        play : function () {
            this._.tag.play();
        },
        pause : function () {
            this._.tag.pause();
        },
        stop: function () {
            this.pause();
            this.load( null );
        },
        get_seek: function (){
            return this._.tag.currentTime * 1000;
        },
        set_seek: function( ms ){
            this._.tag.currentTime = ms * 0.001;  
        },
        duration : function (){
            return this._.tag.seekable.end() * 1000;
        }
    })
);/*!
 *
 * Event.js
 * com.neuromantic.arete.environment.Browser
 *
 */
_package( 'com.neuromantic.arete.environment',
    _class( 'Browser', {
        static_isMobile : function () {
            if( (navigator.userAgent||navigator.vendor||window.opera)){
                  return (function(a){return(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))})(navigator.userAgent||navigator.vendor||window.opera);
            }
            return false;
        }//,
    })
);/*!
 *
 * URIUtil.js
 * com.neuromantic.arete.utils.Event
 *
 * based on parseUri 1.2.2, (c) Steven Levithan <stevenlevithan.com> (MIT License)
 */
_package( 'com.neuromantic.util',
    _class( 'URIUtil', {
        static_parse : function( uriString ){
            var o = URIUtil.options,
            m = o.parser[o.strictMode ? "strict" : "loose"].exec(uriString),
            uri = {},
            i = o.key.length;
            while (i--) uri[o.key[i]] = m[i] || "";
            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                if ($1) uri[o.q.name][$1] = $2;
            });
            return uri;
        },
        static_options : {
            strictMode: false,
            key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        }//,
    })
);/*!
 *
 * Player.js
 * com.grabnetworks.player.Player
 *
 */
_package( 'com.grabnetworks.player',
    _import('com.deconcept.swfobject'),
    _import( 'com.grabnetworks.player.PlayerEvent' ),
    _import( 'com.grabnetworks.vidify.Badger' ),
    _import( 'com.grabnetworks.loading.ContentLoader' ),
    _import( 'com.grabnetworks.proto.GrabApp' ),
    
    _import( 'com.neuromantic.arete.dom.elements.Div'),
    _import( 'com.neuromantic.arete.dom.elements.media.Video'),
    _import( 'com.neuromantic.arete.dom.elements.media.Img'),
    _import( 'com.neuromantic.arete.environment.Browser'),
    _import( 'com.neuromantic.arete.utils.URIUtil'),
    _import( 'com.neuromantic.arete.net.JSONP'),
    _import( 'com.neuromantic.arete.events.LoadingEvent'),
    _import( 'com.neuromantic.arete.events.Notifier'),
    _class( 'Player' )._extends( 'GrabApp', {
    	static_local: false,
        static_players : [],
        private_swf: null,
        private_video: null,
        private_currentVideo: null,
        private_settings: {
            width: 640,
            height: 360
        },
        private_deferredCalls: [],
        private_ready: false,
        private_div : null,
        private_likeDiv: null,
        private_parent : null,
        private_environment : 'grabqa', // 'grabnetworks',
        private_defer: function( fn, args ) {
            var deferredCall;
            if( typeof fn === 'function' ){
                deferredCall = function () { fn.apply( null, args) };
            }else{
                if( this._.swf){
                    var _this = this;
                    deferredCall = function (){ _this._.swf[fn].apply( null, args ); };
                }else{
                    deferredCall = { name: fn, args: args };
                }
            }
            try {
                deferredCall();
            } catch (e) {
                this._.deferredCalls.push( deferredCall );
            }
        },
        private_callDeferred : function (){
            for( var i = 0; i < this._.deferredCalls.length; i++){
                    var fn = this._.deferredCalls[i];
                    if (fn) {
                        var args = fn.args;
                        if( fn.name ){
                            fn = this._.swf[ fn.name ];
                        }
                        fn.apply(this, args);
                        this._.deferredCall = null;
                    }
                }
        },
        private_buildHTML : function (){
            this.type = 'h5';
    		if( !this._.video ){
                this._.video = new Video( {
                    height : this._.settings.height,
                    width : this._.settings.width,
                    id : this._.playerID,
                    style : {
                        background : 'black' 
                    }
                } );
			}
            if(this._.div){
                this.replace( this._.video, this._.div );
            }
            this._.notify( new PlayerEvent( PlayerEvent.PLAYER_READY ) );
        },
        private_onSWFObject : function( swf ){
            if(swf.ref){
                this._.swf = swf.ref;
                this.type = 'v5';
            if(this._.settings.likeButton){
               this._.likeDiv = new Div( { id: 'grabLike'} );
               this._.likeDiv.width( this.width() );
               this._.likeDiv.height( 70 );
               this.append( this._.likeDiv );
            }
            }else{
                this._.buildHTML(); 
            }
            if(this._.playlist){
                this.renderContent( this._.playlist.videos[0], { autoPlay : this._.settings.autoPlay || this._.options.grabnetworks.player.behavior.autoPlay } );
            }
            if (typeof this._.onReady === 'function') {
                this._.onReady();
    			this._.onReady = null;
            }
        },
        private_trySWF : function () {
            var settings = this._.settings;
            var params = { allowScriptAccess: 'always', allowFullScreen: 'true', wmode: 'transparent', menu: 'false', bgcolor: '#000000', quality: 'high' };//params
			var env = settings.env || '';
			delete settings.env;
			var width = settings.width || 640;
			var height = settings.height || 360;
			var flashvars = settings;
			var namespace = 'com.grabnetworks.player.Player.players[' + this.id + ']';
			var eventhandler = 'eventRouter';
			flashvars.namespace = namespace;
			flashvars.eventhandler = eventhandler;
            flashvars.content = false;
            this._.options.grabnetworks.content = false;
            var optionsString = JSON.stringify( this._.options );
            flashvars.config = encodeURIComponent(optionsString);
            var attributes = { id: this._.playerID, name: this._.playerID };
           // if ( !settings.local && scriptInfo.host.indexOf('grabqa') > -1 ){
           //     settings.tgt = settings.tgt || 'grabqa';
           //     this._.environment = 'grabqa';
           // }
            var swfDir = ( settings.local ) ?  settings.local + '/'  : 'http://player.' + this._.environment + '.com/v5' + env + '/';
            swfobject.embedSWF( swfDir + 'Player.swf', this._.div.id(), width, height, '9.0.0', false, flashvars, params, attributes, this._.onSWFObject);
        }, 
        private_build : function () {
            this._.playerID = 'GrabPlayer' + this.id;
            var divID = 'grabDiv' + this.id;
            if(! this._.div ) {
    			this._.div = Element.byID( divID );
                if( this._.div ){
                    this._.div.parent().replace( this, this._.div );
                }else{
                    this._.div = new Div( { id : divID } );
                    this._.div.style({ backgroundColor : '#000000' });
                    this.width( this._.settings.width );
                    this.height( this._.settings.height );
                }
            }
            this.append( this._.div );
            this._.previewImage = new Img(); 
            this.append( this._.previewImage );
            this._.playButton = new Img({ src:'http://static.grab-media.com/images/badges/playL.png' });
            this.append( this._.playButton );
            this._.trySWF();
        },
        private_setup: function (){
        	Player.players[ this.id ] = this;  
        },
        /************************* events **************************/
        private_layout : function () {
            if( this._.likeDiv ){
                this._.likeDiv.y( this._.settings.height );
                this._.height = this._.likeDiv.y() + this._.likeDiv.height();
            }
            this._super()._.layout();
            if(this._.previewImage){
                this._.previewImage.x( 0 );
                this._.previewImage.y( 0 );
                this._.previewImage.height( this._.settings.height );
                this._.previewImage.width( this._.settings.width );
            }
            if( this._.playButton ){
                this._.playButton.x( ( this._.settings.width - this._.playButton.width() ) * 0.5 );
                this._.playButton.y( ( this._.settings.height - this._.playButton.height() ) * 0.5 );
            }
        },
        private_onMouseOver : function ( event ){
            if( this._.video ){
                this._.video.tag({ controls : 'controls' });
            }
        },
        private_onMouseOut : function ( event ){
            if( this._.video ){
                this._.video.tag({ controls : null });//until a ui layer exists
            }
        },
        private_onPlayButtonClick : function ( event ){
            this.playVideo();
        },
        private_onImageLoaded : function ( event ){
            this._.layout();
        },
        private_addEvents : function (){
            this.on( MouseEvent.OVER, this._.onMouseOver);
            this.on( MouseEvent.OUT, this._.onMouseOut);    
            this._.playButton.on( MouseEvent.CLICK, this._.onPlayButtonClick );
            this._.playButton.on( LoadingEvent.COMPLETE, this._.onImageLoaded );
            this._.previewImage.on( LoadingEvent.COMPLETE, this._.onImageLoaded );
        },
        /***********************************************************/
        private_load : function ( guid ) {
            if(this._.video){
                this._.loadPlaylist( guid );
            }else{
                this._.swf.loadNewVideo( guid );
            }
        },
        private_play : function () {
            this._.previewImage.visible( false );
            this._.playButton.visible( false );
            if(this._.video){
                this._.video.play();
            }else{
                this._.swf.playVideo();
             }
        },
        private_pause : function () {
            if(this._.video){
                this._.video.pause();
            }else{
                this._.swf.pauseVideo();
            }
        },
        private_stop : function () {
            this._.previewImage.visible( true );
            this._.playButton.visible( true );
            if(this._.video){
                this._.video.stop();
            } else {
                this._.swf.stopVideo();
            }
        }, 
        private_seek : function ( ms ){
            if(this._.video){
                this._.video.seek( ms );
            }else{
                this._.swf.seekVideoToMS( ms );
            }
        },
        private_seekPercent : function ( pct ){
            if(this._.video){
                this._.seek( ( pct * 0.01 ) * ( this._.video.duration ) );
            }else{
                this._.swf.seekVideoTo( pct );
            }
        },
        private_setVolume : function ( level ){
            if(this._.video){
                this._.video.volume = level * 0.01;
            }else{
                this._.swf.setVolume(level);
            }
        },
        private_renderVideo : function( content, secret ){
            if(this._.video){
                this._.video.load( content.video.media.mobile.url );
            }else{
                this._.swf.renderContent( content );
            }
            if (secret && secret.autoPlay){
                this.playVideo();
            }else{
                this.stopVideo();
            }
        },
        Player : function ( settings ){
            if ( settings.variant === '' ) {
				delete settings.variant;
			}//if
            this._super( settings );
		},
        eventRouter: function(eventObject) {
            if ( eventObject.event == PlayerEvent.PLAYER_READY ) {
                this._.callDeferred();
            }
            this._.notify( new PlayerEvent( eventObject.event, eventObject.value ) );
        },
        hide : function () {
            this.destroy();
            this._super().hide();
        },
        show: function () {
            this._super().show();
            if( ! this._.swf && ! this._.video ){
                this._.render();
            }
        },
        destroy: function() {
            if (this._.swf) {
                this.replace( this._.div, new Element(this._.swf));
                this._.swf = null;
            }
            if (this._.video) {
                this.replace( this._.div, this._.video);
                this._.video = null;
            }
            if (this._.previewImage){
                this.remove( this._.previewImage);
                this._.previewImage = null;
            }
            if (this._.playButton){
                this.remove( this._.playButton);
                this._.playButton = null;
            }
            
        },
        id : 'uninitialized',
        type : 'uninitialized',
        renderContent: function( content, secret ) {
            var media = content.video.media;
            this._.previewImage.load( media.preview.url || media.thumbnail.url );
            this._.defer( this._.renderVideo, arguments );
        },
        loadNewVideo: function( guid, secret ) {
            this._.defer( this._.load, arguments);
        },
        toggleDebug: function() {
            this._.defer( 'toggleDebug' );
        },
        stopVideo: function() {
            this._.defer( this._.stop );
        },
        showEmbed: function() {
          this._.defer( 'showEmbed' );
        },
        hideEmbed: function() {
          this._.defer( 'hideEmbed' );
        },
        hideInfo: function() {
          this._.defer( 'hideInfo' );
        },
        showInfo: function() {
          this._.defer( 'showInfo' );
        },
        showSharing: function() {
          this._.defer( 'showSharing' );
        },
        hideSharing: function() {
          this._.defer( 'hideSharing' );
        },
        showEmail: function() {
          this._.defer( 'showEmail' );
        },
        hideEmail: function() {
          this._defer( 'hideEmail' );
        },
        pauseVideo: function() {
            this._.defer( this._.pause );
        },
        playVideo: function() {
            this._.defer( this._.play );
        },
        replayVideo: function() {
          this._.defer( 'replayVideo' );
        },
        seekVideoTo: function( percent ) {
          this._.defer( this._.seekPercent, arguments);
        },
        seekVideoToMS: function( milliseconds ) {
          this._.defer( this._.seek, arguments );
        },
        setVolume: function(level) {
          this._.defer( this._.setVolume, arguments );
        },
        mute: function() {
          this._.defer( 'mute' );
        },
        skipAd: function() {
          this._.defer( 'skipAd' );
        },
        videoTotalTime: function() {
            if( this._.video){
                return this._.video.duration();
            }
            return this._.swf.videoTotalTime();
        },
        videoCurrentTime: function() {
          return this._.swf.videoCurrentTime();
        },
        videoTitleText: function() {
          return this._.swf.videoTitleText();
        },
        videoDescriptionText: function() {
          return this._.swf.videoDescriptionText();
        },
        videoSourceLogo: function() {
          return this._.swf.videoSourceLogo();
        },
        videoSourceURL: function() {
          return this._.swf.videoSourceURL();
        },
        videoInfo: function() {
          return this._.swf.videoInfo();
        }
	})
);var scripts = document.getElementsByTagName( "script" );
var script = scripts[ scripts.length - 1 ];
var query = script.src.split("?")[1];
if( query && query.length > 0 ){
	var settings = {};
	var list = query.split( "&");
	for (var i = 0; i < list.length; i++ ){
		var pair = list[i].split("=");
		settings[pair[0]] = pair[1];
	};
	new com.grabnetworks.player.Player( settings );
}
})();