/*!
 *
 * Code.js
 *
 * Class / Object Descripion Engine for Javascript
 *
 * https://github.com/neuromantic/CodeJS
 *
 * Copyright 2012, Neuromantic Industries http://www.neuromantic.com
 * Licensed under the MIT license.

 * The original concept for this project and early versions of the code (as FaseJS) were co-created by
 * Ross Sclafani, http://ross.sclafani.net and Edward Hotckiss, http://www.edwardhotchkiss.com/
 * (Hotchkiss is also attributed in some parts of this code as `For Sure, Rad!`)
 *
 * Many thanks to the original authors, and the Open Source Software community at large
 *
 */
 
(function() {
    global = (typeof window == 'object') ? window : (typeof global == 'object') ? global : { dev: null };
    console = console || {};
    console.log = console.log || function() {};
    var fs, path, ast, ugg, http;
    if (typeof require === 'function') {
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
            stringify: function(obj, done) {
                if (typeof obj === 'undefined') {
                    return '{undefined}';
                }
                if (obj === null) {
                    return '{null}';
                }
                if (obj.tagName) {
                    return '<' + obj.tagName + '>';
                }
                //				if (obj._className){
                //					return obj.toString();
                //				}
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
                switch (typeof obj) {
                case 'object':
                    s += '{ ';
                    for (var key in obj) {
                        val = obj[key];
                        var type = typeof val;
                        if (done) {
                            val = (type === '{object}' || type === '{function}') ? type : val;
                        }
                        else {
                            val = _.util.stringify(val, true);
                        }
                        s += ' ' + key + ' : ' + val + ',';
                    }
                    s = s.slice(0, - 1);
                    s += ' }';
                    return s;
                case 'function':
                    return '{function}';
                default:
                    return obj;
                }
            },
            deepCopy: deepCopy,
            scope: function(fn, scope, functionName) {
                return function() {
                    return fn.apply(scope, arguments);
                }; //closure
            }, //scope
            isMethod: function(property) {
                return ((typeof property === 'function') && (!(property instanceof RegExp)));
            } //isMethod
        }, // util
        loader: {
            queue: [],
            _import: function(classPath) { //--------------------------------------------------------------- loader._import (load)
                if (_.loader.queue.indexOf(classPath) < 0) {
                    _.loader.load(classPath); // push path into loading queue
                } // if
            }, // _import
            _class: function(className) { //--------------------------------------------------------------- loader._class (stub)
_debug('creating stub class for', className);
                var stub = {
                    _extends: function(superName) {
_debug('which extends', superName)
                        this._super = superName; //set super name for definition tree
                    } // _extends
                }; // stub
                global[className] = stub;
                return global[className];
            }, // _class
            load: function(classPath) {
_debug('loading', classPath)
                var code, scriptPath;
                //TODO: http classPaths
                var binPath = 'bin/' + classPath;
                scriptPath = 'src/' + classPath.replace(/\./g, '/') + '.js';
                try {
                    this.queue.push(classPath);
                    if (fs && path && ast && ugg) { //server
                        try {
_verbose('looking for bytecode in', binPath);
                            code = fs.readFileSync(binPath);
                        }
                        catch (e) {
_verbose('no bytecode available.');
                            try {
_verbose('loading source code from', scriptPath);
                                code = fs.readFileSync(scriptPath, 'ascii');
                                try {
_verbose('generating bytecode for', classPath, 'source bytes =', code.length);
                                    if (!_.debugging) {
                                        code = ast.parse(code); // parse code and get the initial AST
                                        if (classPath == 'Code') {
                                            code = ugg.ast_mangle(code); // get a new AST with mangled names
_verbose('mangling', classPath);
                                        }
                                        code = ugg.ast_squeeze(code); // get an AST with compression optimizations
_verbose('squeezing', classPath);
                                        code = ugg.gen_code(code); // compressed code here

                                        code = (code.substr(0, - 1) === ';') ? code : (code + ';');
                                    }
                                    if (!path.existsSync('bin/')) {
                                        _info('creating bin');
                                        fs.mkdirSync('bin/');
                                    }
_verbose('writing bytecode to', binPath, 'final bytes =', code.length);
                                    fs.writeFileSync(binPath, code);
                                }
                                catch (error) {
                                    throw new Error(error);
_verbose('error creating bytecode');
                                }
                            }
                            catch (error) {
_error('file system error');
                                throw new Error(error);
                            }
                        }
                    }
                    else { //client // ( typeof XMLHttpRequest == "function" )
_verbose('streaming source code from', scriptURL);
                        var scriptURL = scriptPath;
                        var request = new XMLHttpRequest();
                        request.open('GET', scriptURL, false);
                        request.send(null);
                        if (request.status == 200) {
                            code = request.responseText;
                        }
                        else { // else if
_error('XMLHttpRequest error');
                            throw new Error(request.status);
                        } // else
                    }
                }
                catch (error) {
_error('error loading', classPath, ':', error.message);
                    throw error;
                }
_verbose('loaded', classPath, 'successfully. processing imports');
                try {
                    global._import = this._import; //load
                    global._class = this._class; //stub
                    code = code.toString();
                    if( classPath !== 'Code' && code.indexOf('_import') > -1 ) {
_verbose( 'found import statement(s), performing them...');
                        eval(code);
                    }else{
_verbose( 'no imports present, skipping.');
                    }
                }
                catch (error) {
_error('error completing imports for ' + classPath + '. Error Text:' + error.message);
                    throw error;
                }
                var className = classPath.split('.').pop();
                global[className] = global[className] || {};
                global[className]._script = code; //store script
                _.compiler.queue.push(className); // add script to compilation queue
                if (this.queue.length == _.compiler.queue.length) {
                    _.compiler.compileClasses();
                    this.queue = [];
                } // if
            } //, load
        }, // loader
        compiler: {
            buffer: '',
            queue: [],
            _import: function(classPath) {
                var className = classPath.split('.').pop();
                _.compiler.compile(className);
            }, // _import
            _class: function(className) {
_verbose('skipping _class');
                return {
                    _extends: function() {}
                }
            }, // _import
            compileClasses: function() {
_verbose('compiling classes');
                var className;
                while (className = this.queue[0]) {
                    this.compile(className);
                } // while
                _.interpreter.defineClasses();
                this._queue = [];
            }, // compileClasses
            compile: function(className) {
                var index = this.queue.indexOf(className);
                if (index >= 0) {
                    this.queue.splice(index, 1);
                    var classObject = global[className];
_verbose('adding class', className);
                    global._import = this._import;
                    global._class = this._class;
                    if (classObject._script.indexOf('_class') > -1 || classObject._script.indexOf('_import') > -1) {
                        eval(classObject._script);
                    }
                    this.buffer = this.buffer.concat(classObject._script);
_verbose(this.buffer.length, 'bytes', this.queue.length, 'scripts remain.');
                } // if
            } //compile
        }, // compiler
        interpreter: {
            initializing: false,
            _import: function(classPath) { //--------------------------------------------------------------- interpreter._import (null)
_verbose('skipping import: ', classPath);
            }, // _import
            _class: function(className, properties) { //--------------------------------------------------------------- interpreter._class define
_verbose('_class', className);
                if (global[className] && global[className]._constructor) { // if class is stub
                    return;
                }
                else {
                    var newClass = Class._plus(className, properties); // create the class from Class object
                    newClass._extends = function(parentClassName, properties) {
_verbose('_extends', parentClassName);
                        global[className] = global[parentClassName]._plus(className, properties);
                        global[className]._className = className;
                    }; // _extends
                    global[className] = newClass;
                } //if
                _.interpreter.applicationName = className;
                return global[className];
            }, // _class
            defineClasses: function() {
_verbose('defining classes');
                global._import = this._import; // null
                global._class = this._class; // define / extend class
                eval(_.compiler.buffer);
                _.compiler.buffer = '';
                Code.x();
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
    DebugLevels.LABELS = ['SILENT', 'ERROR', 'WARNING', 'INFO', 'DEBUG', 'VERBOSE'];
    global._trace = function() {
        var output = "";
        var args = arguments;
        for (var index in args) {
            var token = _.util.stringify(args[index]);
            output += token + (' ');
        } // for
        console.log(output);
    }; // _trace

    _error = function() {
        if (_.debugging >= DebugLevels.ERRORS) _trace.apply(this, arguments);
    }; //
    _warn = function() {
        if (_.debugging >= DebugLevels.WARNINGS) _trace.apply(this, arguments);
    }; //
    _info = function() {
        if (_.debugging >= DebugLevels.INFO) _trace.apply(this, arguments);
    }; //
    _debug = function() {
        if (_.debugging >= DebugLevels.DEBUG) _trace.apply(this, arguments);
    }; //
    _verbose = function() {
        if (_.debugging >= DebugLevels.VERBOSE) _trace.apply(this, arguments);
    }; //

    _package = function() { // Future Use
_verbose('package', arguments[0]);
    }; // _package


    // DON'T GET CUTE.


    /*
     *
     * Class is a modification of 'Class'
     * originally by the immortal John Resig
     *
     * http://bit.ly/4U5H
     *
     *
     */
    //var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation --
    // provides _get and _set shortcuts to eliminate abiguous assignment ( is it a property or a getterSetter ? )
    // provides .add() to replace +=
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
        var superPrototype = this.prototype;

        newPrototype._ = superPrototype._ ? _.util.deepCopy(superPrototype._) : {}; // private space
        newPrototype.__ = superPrototype.__ ? _.util.deepCopy(superPrototype.__) : {
            getters: {},
            setters: {},
            getSetterNames: []
        }; // getters/setters space

        // TODO: getter/setters proper

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
                attachTarget = newPrototype.__.getters;
                propertyName = name.substring(name.indexOf(propertyKeyword) + propertyKeyword.length + 1, name.length);
                if (newPrototype.__.getSetterNames.indexOf(propertyName) == -1) {
                    newPrototype.__.getSetterNames.push(propertyName);
                }
            }
            else if (name.indexOf('set_') >= 0) {
                propertyKeyword = 'set';
                attachTarget = newPrototype.__.setters;
                propertyName = name.substring(name.indexOf(propertyKeyword) + propertyKeyword.length + 1, name.length);
                if (newPrototype.__.getSetterNames.indexOf(propertyName) == -1) {
                    newPrototype.__.getSetterNames.push(propertyName);
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
                property = ( function(propertyName, fn, _super) {
                    return function() {
                        var args = '';
                        for (var i in arguments) {
                            args += _.util.stringify(arguments[i]) + ',';
                        }
                        args = args.slice(0, - 1);
_verbose(className + '.' + propertyName + '( ' + args + ' )');
                        var tmp = this._super;
                        // Allow this._super() to call superconstructor, and allow this._super().*() to call the super method
                        this._super = function() {
                            if (propertyName === '__init__') {
                                var __init__ = _super.__init__ || function() {};
                                _super = _super._superPrototype;
                                return __init__.apply(this, arguments)
                            }
                            else {
                                var names = [];
                                var sup = {};
                                for (var memberName in _super) {
                                    var member = _super[memberName];
                                    if (typeof member === 'function') {
                                        sup[memberName] = _.util.scope(member, this, memberName);
                                        names.push(memberName);
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
                })(propertyName, addition, superPrototype);
            }
            else {
                propertyType = 'var';
                propertyDefault = addition;
                property = _.util.deepCopy(addition);
            }
            attachTarget[propertyName] = property;
_verbose('\t', propertyKeyword, propertyType, propertyName, '=', propertyDefault);
        }

        // Create getter / setter properties
        for (var index in newPrototype.__.getSetterNames) {
            var getSetterName = newPrototype.__.getSetterNames[index];
_verbose('property name:', getSetterName);
            var getter = newPrototype.__.getters[getSetterName];
_verbose('getter function:', getter);
            var setter = newPrototype.__.setters[getSetterName];
_verbose('setter function:', setter);
            newPrototype[getSetterName] = (function(getter, setter, getSetterName) {
                return function(value) {
                    if (value === undefined) {
                        if (getter) {
_verbose('getting', getSetterName, 'of', this, ':', getter());
                            return getter.call(this);
                        }
                        else return;
                    }
                    if (setter) {
_verbose('setting', getSetterName, 'of', this, 'to', value);
                        setter.call(this, value);
                    }
                }
            })(getter, setter, getSetterName);
        };
        // The dummy class constructor (scoping)
        function ClassObject() {
            // All construction is actually done in the __init__ method (declared using the new Class name as string ( _className ) )
            this._ = _.util.deepCopy(this._);
            this.__ = _.util.deepCopy(this.__);
            if (!_.interpreter.initializing) {
_verbose('new', this._className);
                if (this._className.indexOf('Event') < 0 && ['Dictionary'].indexOf(this._className) < 0) {
                    // XXX What's this for?
                }
                for (var propertyName in this) {
                    var property = this[propertyName];
                    if (_.util.isMethod(property) && ['toString', '_get', '_set', '_add'].indexOf(propertyName) < 0) {
_verbose('scoping public', propertyName)
                        this[propertyName] = _.util.scope(property, this, propertyName);
                    } //if
                } //for

                for (propertyName in this._) {
                    var property = this._[propertyName];
                    if (_.util.isMethod(property)) {
_verbose('scoping private', propertyName)
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

        return ClassObject;
    };

    var Code = function() {
        return Code.c('Code');
    };
    Code.r = function(applicationClassPath, parameters) {
_verbose('Code.r(', applicationClassPath, ',', _.util.stringify(parameters), ')');
        _.application.parameters = parameters;
        _.application.classPath = applicationClassPath;
        global._import = _.loader._import;
        _import(applicationClassPath);

    };
    Code.x = function(applicationClassPath, parameters) {
_verbose('Code.x(', applicationClassPath, ',', _.util.stringify(parameters), ')');
        parameters = parameters || this._.application.parameters;
        applicationClassPath = applicationClassPath || this._.application.classPath;
        var applicationClassName = applicationClassPath.split('.').pop();
        new global[applicationClassName](parameters); //no namespace
        _.application = {};
    };
    Code.c = function(applicationClassPath) {
_debug('Code.c(', applicationClassPath, ')');
        var libPath = 'lib/' + applicationClassPath + '.js';
        var buffer;
        if (fs && path && path.existsSync( libPath ) ) {
                buffer = fs.readFileSync(libPath, 'ascii');
        }else{
_warn('no library at', libPath);
        }
        if (!buffer) {
            var interpreter = _.interpreter;
            _.interpreter = {
                defineClasses: function() {
_verbose('bypassing interpreter.');
                }
            };
            global._import = _.loader._import;
            _import(applicationClassPath);
            buffer = _.compiler.buffer;
            if (fs && path) {
                if (!path.existsSync('lib/')) {
_debug('creating lib folder')
                    fs.mkdirSync('lib/');
                }
_debug('saving lib file to', libPath)
                fs.writeFileSync(libPath, buffer);
            }
            _.compiler.buffer = '';
            _.interpreter = interpreter;
        }
        return buffer;
    };
    Code._ = _;
    global.Code = Code;
    global._import = _.interpreter._import;
    global._class = _.interpreter._class;
console.log('Code.js is ready. @2013 Neuromantic, LLC. All Rights reserved. Licenced under the MIT license.');

    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Goin' Deep /////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    //	 DEEP COPY props http://oranlooney.com/deep-copy-javascript/
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

    // Code.js : Fase Dictionary
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
})();