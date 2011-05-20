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
_package( 'com.fasejs.fs.transitions',

 	_import( 'com.fasejs.util.Timer' ),
 	
	_class('Tween')._extends('Timer', {
		static_frameRate : 100,
		static_defaultEasing : Easing.easeInOutQuad,
		toProperties : null,
		tweenDuration : 0,
		private_startTime : 0,
		easing : null,
		currentTime : function () {
			var seconds = Date.now() * 0.001;
			//_trace('current time:', seconds )
			return seconds
		},
		elapsedTime : function () {
			return this.currentTime() - this._.startTime;
		},
		static_to : function( target, duration, properties ) {
			var tween = new Tween( target, duration, properties) ;
		},
		static_delta : function( target, duration, properties ) {
			var deltaProperties = {};
			for ( var propertyName in properties ) {
				if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
					deltaProperties[ propertyName ] = Number( target._get( propertyName ) + properties[ propertyName ]);
				}else{
					deltaProperties[ propertyName ] = properties[ propertyName ];
				};
			};
			var tween = new Tween( target, duration, deltaProperties );
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
				if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
					target._set( propertyName , properties[ propertyName ] );
				}else{
					originalProperties[ propertyName ] = properties[ propertyName ];
				};
			};
			var tween = new Tween( target, duration, originalProperties );
		},
		Tween : function( target, duration, properties ) {
			this.target = target;
			this.tweenDuration = duration;
			this.toProperties = properties;
			this.easing = properties.easing || Tween.defaultEasing;
			this.addEventListener( TimerEvent.TIMER, this.timerHandler );
			this._super( 1000 / Tween.frameRate );
			this.fromProperties = {};
			var _properties = properties;
			if( properties.onComplete ) {
				this.addEventListener( TweenEvent.COMPLETE, function( event ) { properties.onComplete( event ); } );
				delete this.toProperties.onComplete ;
			};
			if( properties.onStart ) {
				this.addEventListener( TweenEvent.START,     function( event ) { properties.onStart( event );    } );
				delete this.toProperties.onStart  ;
			};
			if( properties.onUpdate ) {
				this.addEventListener( TweenEvent.UPDATE,    function( event ){ properties.onUpdate( event );   } );
				delete this.toProperties.onUpdate ;
			};
			if ( Tween.targets.indexOf( this.target ) < 0 ){
				Tween.targets.push ( this.target );
				Tween.tweens[ Tween.targets.indexOf( this.target ) ] = [];
			};
			Tween.getTweensOf( this.target ).push( this );
			if( properties.delay ) {
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
			this._dispatchEvent( new TweenEvent( TweenEvent.START , this ) );
			this._.startTime = this.currentTime();
			for ( var propertyName in this.toProperties ) {
				if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
					this.fromProperties[ propertyName ] = this.target._get( propertyName );
					_trace( 'starting tween on', this.target, 'of property',propertyName,'from:', this.fromProperties[ propertyName ], 'to:', this.toProperties[ propertyName ] );
				}
			};
			if ( this.tweenDuration === 0 ) {
				this.updateTween();
			}
			this.start();
		},
		updateTween : function () {
			this._dispatchEvent( new TweenEvent( TweenEvent.UPDATING , this ) );
			if( this.elapsedTime() > this.tweenDuration ) {
				return this.stopTween( true );
			};
			for ( var propertyName in this.toProperties ) { //all equations use this signature  (t: current time, b: beginning value, c: end value, d: duration)
				if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
					var newValue = this.easing( this.elapsedTime(), this.fromProperties[ propertyName ], this.toProperties[ propertyName ], this.tweenDuration );
					this.target._set( propertyName , newValue );
				}
			};
			this._dispatchEvent( new TweenEvent( TweenEvent.UPDATE , this ) );
		},
		stopTween : function ( finish ) {
			if( finish ) {
				for( var propertyName in this.toProperties ) {
					if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
						this.target._set( propertyName , this.toProperties[ propertyName ] );
					}
				};
			};
			this._dispatchEvent( new TweenEvent( TweenEvent.COMPLETE , this ) );
			this.stop();
		}//,
	}//,
));
			
			
		