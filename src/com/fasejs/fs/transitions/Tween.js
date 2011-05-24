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
// _package( 'com.fasejs.fs.transitions',
// 
 	// _import( 'com.fasejs.util.Timer' ),
 	// _import( 'com.fasejs.transitions.Easing' ),
		_class( 'Tween' )._extends( 'Timer', {
			static_frameRate : 100,
			static_defaultEasing : Easing.easeInOutQuad,
			
			private_toProperties : null,
			private_tweenDuration : 0,
			private_startTime : 0,
			
			easing : null,
			currentTime : function () {
				var seconds = Date.now() * 0.001;
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
			// static_tweens: [],
			// static_targets : [],
			// static_getTweensOf : function( target ) {
				// return Tween.tweens[ Tween.targets.indexOf( target ) ];
			// },
			// static_killTweensOf : function( target, finish ) {
				// var targetTweens = Tween.getTweensOf( target ); 
				// for (var index in targetTweens){
					// targetTweens[ index ].kill( finish );
				// }
			// },
			// static_killAllTweens : function ( finish ) {
				// for (var index in Tween.targets){
					// Tween.killTweensOf( targets[ index ], finish );
				// }
			// },
			static_from : function( target, duration, properties ) {
				var originalProperties = {};
				for ( var propertyName in properties ) {
						originalProperties[ propertyName ] = target._get( propertyName );
					if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
						target._set( propertyName , properties[ propertyName ] );
					}else{
						originalProperties[ propertyName ] = properties[ propertyName ];
					};
				};
				var tween = new Tween( target, duration, originalProperties );
			},
			Tween : function( target, duration, properties ) {
// _trace( 'New Tween', target, duration, properties );
				this.addEventListener( TimerEvent.TIMER, this.timerHandler );
				this._super( 1000 / Tween.frameRate );
				this._.target = target;
				this._.tweenDuration = duration;
				this._.toProperties = properties;
				this._.easing = properties.easing || Tween.defaultEasing;
				this._.fromProperties = {};
				var _properties = properties;
				if( properties.onComplete ) {
					this.addEventListener( TweenEvent.COMPLETE, function( event ) { _properties.onComplete( event ); } );
					// delete this.toProperties.onComplete ;
				};
				if( properties.onStart ) {
					this.addEventListener( TweenEvent.START, function( event ) { _properties.onStart( event ); } );
					// delete this.toProperties.onStart  ;
				};
				if( properties.onUpdate ) {
					this.addEventListener( TweenEvent.UPDATE, function( event ) { _properties.onUpdate( event ); } );
					// delete this.toProperties.onUpdate ;
				};
				// if ( Tween.targets.indexOf( this._.target ) < 0 ){
					// Tween.targets.push ( this._.target );
					// Tween.tweens[ Tween.targets.indexOf( this._.target ) ] = [];
				// };
				// Tween.getTweensOf( this._.target ).push( this );
				if( properties.delay ) {
					this.delayTimer = new Timer( properties.delay * 1000, 1 );
					var _this = this;
					this.delayTimer.addEventListener( TimerEvent.COMPLETE, function() { _this.onDelayComplete() }  );
// _trace('delaying tween of', this._.target );
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
				if( this._.delayTimer ){
					this._.delayTimer.stop();
					this._.delayTimer = null;
				}
				this.stopTween( finish )
			},
			delayTimer : null,
			timerHandler : function( event ){
				event.target.updateTween();
			},
			startTween : function () {
// _trace( 'starting tween of', this.target );
				this._dispatchEvent( new TweenEvent( TweenEvent.START , this ) );
				this._.startTime = this.currentTime();
				for ( var propertyName in this._.toProperties ) {
					if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
						this._.fromProperties[ propertyName ] = this._.target._get( propertyName );
// _trace( this._.target, propertyName, ':', this._.fromProperties[ propertyName ], '-->', this._.toProperties[ propertyName ], 'over',this._.tweenDuration,'s' );
					}
				};
				if ( this.tweenDuration === 0 ) {
					this.updateTween();
				}
				this.start();
			},
			updateTween : function () {
				this._dispatchEvent( new TweenEvent( TweenEvent.UPDATING , this ) );
				var previousValues  = {};
				for ( var propertyName in this._.toProperties ) { //all equations use this signature  t: current time, b: beginning value, c: change in value, d: duration
					if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
						var newValue = this._.easing( this.elapsedTime(), this._.fromProperties[ propertyName ], this._.toProperties[ propertyName ] - this._.fromProperties[ propertyName ], this._.tweenDuration );
						previousValues[ propertyName ] = this._.target._get(propertyName);
						this._.target._set( propertyName , newValue );
// _trace( String( this.elapsedTime() ).substr(0,5),'s', this._.target, propertyName, ':',previousValues[ propertyName ], '-->', this._.target._get( propertyName ) );
					}
				};
				this._dispatchEvent( new TweenEvent( TweenEvent.UPDATE , this, previousValues ) );
				if( this.elapsedTime() > this._.tweenDuration ) {
					return this.stopTween( true );
				};
			},
			stopTween : function ( finish ) {
				if( finish ) {
					for( var propertyName in this._.toProperties ) {
						if( ['delay', 'onStart', 'onUpdate', 'onComplete', 'onStop'].indexOf( propertyName ) < 0 ){
							this._.target._set( propertyName , this._.toProperties[ propertyName ] );
						}
					};
				};
				this._dispatchEvent( new TweenEvent( TweenEvent.COMPLETE , this ) );
				this.stop();
			}//,
		}//,
	//)
);
			
			
		