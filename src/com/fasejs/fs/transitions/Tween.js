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
		//_trace('current time:', seconds )
		return seconds
	},
	elapsedTime : function () {
		return this.currentTime() - this.startTime;
	},
	static_to : function( target, duration, properties ) {
		//_trace( 'Tween.to', target, duration );
		var tween = new Tween(target,duration,properties);
	},
	static_tweens: [],
	static_targets : [],
	static_getTweensOf : function( target ) {
		return Tween.tweens[ Tween.targets.indexOf( target ) ];
	},
	static_killTweensOf : function( target, finish ) {
		var targetTweens = Tween.getTweensOf( target ); 
		for (var index in  targetTweens){
			targetTweens[index].kill( finish );
		}
	},
	static_killAllTweens : function ( finish ) {
		for (var index in targets){
			Tween.killTweensOf( targets[ index ], finish );
		}
	},
	static_from : function( target, duration, properties ) {
		var originalProperties = {};
		for ( var propertyName in properties ) {
			//_trace( 'storing original value for', propertyName, ':',  target._get( propertyName ) );
			originalProperties[ propertyName ] = target._get( propertyName );
			//_trace( 'setting from value for', propertyName, ':',  properties[ propertyName ] );
			target._set( propertyName , properties[ propertyName ] );
		};
		var tween = new Tween( target, duration, originalProperties );
	},
	init : function( target, duration, properties ) {
		//_trace( 'new Tween', target, duration);
		this.target = target;
		this.tweenDuration = duration;
		this.toProperties = properties;
		this.easing = properties.easing || Tween.defaultEasing;
		this.addEventListener( TimerEvent.TIMER, this.timerHandler );
		this._super( 1000 / Tween.frameRate );
		this.fromProperties = {};
		if( properties.onComplete ){
			//_trace( 'setting onComplete' );
			this.addEventListener( Event.COMPLETE, function(){; properties.onComplete(); } );
		};
		if ( Tween.targets.indexOf( this.target ) < 0 ){
			Tween.targets.push ( this.target );
			Tween.tweens[ Tween.targets.indexOf( this.target ) ] = [];
		};
		Tween.getTweensOf( this.target ).push( this );
		if( properties.delay ) {
			//_trace( 'delaying Tween by', properties.delay );
			this.delayTimer = new Timer( properties.delay * 1000, 1 );
			var _this = this;
			this.delayTimer.addEventListener( TimerEvent.COMPLETE, function() { _this.onDelayComplete() }  );
			this.delayTimer.start();
			delete properties.delay;
		}else{
			this.startTween();
		};
	},
	onDelayComplete : function( event ) {
		this.startTween()
	},
	kill : function ( finish ) {
		if( this.delayTimer ){
			this.delayTimer.stop();
			this.delayTimer = null;
		}
		this.stopTween(  finish )
	},
	delayTimer : null,
	timerHandler : function( event ){
		event.target.updateTween();
	},
	startTween : function () {
		this.startTime = this.currentTime();
		for ( var propertyName in this.toProperties ) {
			this.fromProperties[ propertyName ] = this.target._get( propertyName );
			//_trace( 'starting tween on', this.target, 'of property',propertyName,'from:', this.fromProperties[ propertyName ], 'to:', this.toProperties[ propertyName ] );
		};
		this.start();
	},
	updateTween : function () {
		if( this.elapsedTime() > this.tweenDuration ) {
			return this.stopTween( true );
		};
		for ( var propertyName in this.toProperties ) { //all equations use this signature  (t: current time, b: beginning value, c: end value, d: duration)
			var newValue = this.easing( this.elapsedTime(), this.fromProperties[ propertyName ], this.toProperties[ propertyName ], this.tweenDuration );
			//_trace( this.target, propertyName, newValue );
			this.target._set( propertyName , newValue );
		};
	},
	stopTween : function ( finish ) {
		if( finish ) {
			for( var propertyName in this.toProperties ) {
				this.target._set( propertyName , this.toProperties[ propertyName ] );
				//_trace( 'stopping tween of', this.target, 'at', this.target._get( propertyName ) );
			};
		};
		this._dispatchEvent( new Event( Event.COMPLETE , this ) );
		this.stop();
		//var targetTweens = Tween.getTweensOf(  this.target );
		//targetTweens.splice( targetTweens.indexOf( this ) );
	}//,
});
			
			
		