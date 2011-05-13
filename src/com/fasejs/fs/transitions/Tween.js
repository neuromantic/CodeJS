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
	fromProperties : null,
	properties : null,
	tweenDuration : 0,
	startTime : 0,
	easing : null,
	getCurrentTime : function () {
		return Date.parse(Date.toString()) * 0.001;
	},
	static_to : function ( target, duration, properties ) {
		var tween = new Tween(target,duration,properties)
		if(properties.onComplete){
			tween.addEventListener( Event.COMPLETE, function(){ properties.onComplete(); } );
		};
	},
	static_from : function ( target, duration, properties ) {
		var oldProperties = {};
		for( propertyName in properties ){
			Tween.applyProperty( propertyName, target, oldProperties );
		};
		for( propertyName in properties ){
			Tween.applyProperty( propertyName, properties, target );
		};
		var tween = new Tween( target, duration, oldProperties );
		if(properties.onComplete){
			tween.addEventListener( Event.COMPLETE, function(){ properties.onComplete();  } );
		};
	},
	static_applyProperties : function ( propertyName, fromObject, toObject ) {
		if( typeof fromObject[propertyName] == 'function'){// getter
			if( typeof toObject[propertyName] == 'function'){// setter
					toObject[ propertyName ]( fromObject[ propertyName ]() );
			}else{
				this.fromProperties[ propertyName ] = this.target[ propertyName ]();
			};
		} else {
			if( typeof toObject[propertyName] == 'function'){// setter
				toObject[ propertyName ]( fromObject[ propertyName ] );
			}else{
				this.fromProperties[ propertyName ] = this.target[ propertyName ];
			};
		};
	},
	init : function ( target, duration, properties ) {
		this.target = target;
		this.tweenDuration = duration;
		this.properties = properties;
		this.easing = properties.easing || Tween.defaultEasing;
		this.addEventListener( TimerEvent.TIMER, this.updateTween );
		this._super( 1000 / Tween.frameRate );
		startTween();
	},
	startTween : function () {
		this.startTime = getCurrentTime();
		this.fromProperties = {};
		for(var propertyName in this.properties ) {
			if( this.target[ propertyName ] ) {
				Tween.applyProperty( propertyName, this.properties, this.fromProperies );
			};
		};
		start();
	},
	updateTween : function( event ) {
		for(var propertyName in this.properties ) {
			if( this.target[ propertyName ] && fromProperties[ propertyName ] ) {
				if( typeof this.target[propertyName] == 'function'){// getterSetters
					this.target[ propertyName ](this.easing( this.getCurrentTime() - this.startTime , fromProperties[ propertyName ], properties[ propertyName ], this.tweenDuration ) );
				}else{
					this.target[ propertyName ] = this.easing( this.getCurrentTime() - this.startTime , fromProperties[ propertyName ], properties[ propertyName ], this.tweenDuration );
				};
			};
		};
		if( this.getCurrentTime() - this.startTime + ( this.tickDuration * 0.001 ) > this.tweenDuration ) {
			stop();
			dispatchEvent( new Event( Event.COMPLETE , this ) );
		}
	}
});
			
			
		