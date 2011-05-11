/*!
 *
 * Debug.js
 * com.fasejs.core.Debug
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 
_class('Debug')._extends('Event', {
	static_DEBUG : 0,
	static_INFO  : 1,
	static_EVENT : 2,
	static_WARNING : 3,
	static_ERROR : 4,
	static_SILENT : 5,
	static_DISABLED : 6,
	static_LEVELS : [
		'DEBUG', 'INFO', 'EVENT', 'WARNING', 
		'ERROR', 'SILENT', 'DISABLED'
	],
	_static_level : Debug.DISABLED,
	static_logging : true,
	static_outputFunction : _trace,
	_static_buffer : '',
	static_ignore : [],
	private.static_timestamp : null,
	accumulated : 0,
	buffer : function() {
		return this._buffer;
	},
	setLevel : function(n) {
		this.out(['setting Debug level to ', Debug.LEVELS[n]], 0);
		this._level = n;
	},
	logging : function(b) {
		var status =(b ? 'Dis' : 'En') + 'abling';
		this.out([status + ' logging.'], 0);
		this._logging = b;
	},
	say : function(args) {
		this.out(args, this.DEBUG);
	},
	ignore : function(o) {
		var s = o.toString();
		if (this._ignore.indexOf(s) > -1) {
			this._ignore.push(s);
		};
	},
	info : function(s) {
		this.out(s, this.INFO);
	},
	warn : function(s) {
		this.out(s, this.WARNING);
	},
	error : function(s) {
		this.out(s, this.ERROR);
	},
	event : function(s, event_name) {
		this.out(this.reflect(obj), '.', event_name, this.EVENT);
	},
	debug : function(s) {
		out(s, this.DEBUG);
	},
	setter : function(obj, property, value) {
		this.debug(this.reflect(obj),'.', property, ' = ', value);
	},
	method : function(obj, method_name, s) {
		this.info(this.reflect(obj), '.', method_name, '( ' + s.join(',') + ' )');
	},
	dump : function() {
		this.output_function(_buffer);
		this._buffer = '';
	},
	inspect : function(o, tab) {
		tab += '_';
		for (var id in o) {
			this.debug(tab, id, ':', o[id]);
			if (o[id] === Object) {
				this.inspect(o[id], tab);
			};
		};
	},
	out : function (a, l) {
		var date = new Date();
		var milliseconds = date.getTime();
		var s = date.toTimeString();
		if (timestamp) {
			var elapsed = (milliseconds-timestamp)*.001;
			accumulated += elapsed;
			s += '( ' + elapsed + ' seconds elapsed. ' + accumulated + ' seconds total. )';
		};
		timestamp = milliseconds;
		var skip;
		s += '\n';
		for (var n = 0; n < a.length; n++) {
			var w = a[n].toString();
			skip = (this._ignore.indexOf(w) > -1);
			s += w != '[object global]' ? w : '--';
		}
		log(s);
		if (this._level <= l && !skip) {
			this.output_function(LEVELS[l] + ' : ' + s);
		}
	},
	log : function(s) {
		if (this._logging) {
			this._buffer += s + '\n';
		}
	},
	reflect : function(o, args) {
		var extra = '( ';
		for each(var item in args) {
			extra += item + ' : ' + o[item] + ', ';
		};
		extra = extra.substring(0, extra.lastIndexOf(','));
		extra += ' )';
		return '[' + getQualifiedClassName(o) + extra + ']';
	}
});