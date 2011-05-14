/*!
 *
 * Tween.js
 * com.fasejs.fs.transitions.Tween
 *
 * http://fasejs.com/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
 
_class('Tween')._extends('Timer', {
	static_frameRate : 100,
	static_defaultEasing : Easing.easeInOutQuad,
	toProperties : null,
	tweenDuration : 0,
	startTime : 0,
	easing : null,
	currentTime : function () {
		var seconds = Date.now() * 0.001;
		// _trace('current time:', seconds )
		return seconds
	},
	elapsedTime : function () {
		return this.currentTime() - this.startTime;
	},
	static_to : function( target, duration, properties ) {
		var tween = new Tween(target,duration,properties)
		if(properties.onComplete){
			tween.addEventListener( Event.COMPLETE, function(){ properties.onComplete(); } );
		};
	},
	static_from : function( target, duration, properties ) {
		var originalProperties = {};
		for ( var propertyName in properties ) {
			_trace( 'storing original value for', propertyName, ':',  target._get( propertyName ) );
			originalProperties[ propertyName ] = target._get( propertyName );
			
			_trace( 'setting from value for', propertyName, ':',  properties[ propertyName ] );
			target._set( propertyName , properties[ propertyName ] );
		};
		var tween = new Tween( target, duration, originalProperties );
		if(properties.onComplete){
			tween.addEventListener( Event.COMPLETE, function(){ properties.onComplete(); } );
		};
	},
	init : function( target, duration, properties ) {
		this.target = target;
		this.tweenDuration = duration;
		this.toProperties = properties;
		this.easing = properties.easing || Tween.defaultEasing;
		this.addEventListener( TimerEvent.TIMER, this.timerHandler );
		this._super( 1000 / Tween.frameRate );
		this.fromProperties = {};
		this.startTween();
	},
	timerHandler : function( event ){
		event.target.updateTween();
	},
	startTween : function () {
		this.startTime = this.currentTime();
		for ( var propertyName in this.toProperties ) {
			this.fromProperties[ propertyName ] = this.target._get( propertyName );
			_trace( 'starting tween of property',propertyName,'from:', this.fromProperties[ propertyName ], 'to:',this.toProperties[ propertyName ] );
		};
		this.start();
	},
	updateTween : function( event ) {
		if( this.elapsedTime() > this.tweenDuration ) {
			for ( var propertyName in this.toProperties ) {
				this.target._set( propertyName , this.toProperties[ propertyName ] );
			};
			dispatchEvent( new Event( Event.COMPLETE , this ) );
			return this.stop();
		};
		for ( var propertyName in this.toProperties ) { // all equations use this signature  (t: current time, b: beginning value, c: end value, d: duration)
			var newValue = this.easing( this.elapsedTime(), this.fromProperties[ propertyName ], this.toProperties[ propertyName ], this.tweenDuration );
			this.target._set( propertyName , newValue );
		};
	}
});
			
			
		