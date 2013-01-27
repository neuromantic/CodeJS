/*!
 *
 * Tween.js
 * com.neuromantic.arete.fx.Tween
 *
 * https://github.com/neuromantic/CodeJS/
 *
 * Copyright 2011, Neuromantic Industries & For Sure, Rad!
 * Licensed under the MIT license.
 *
 */
_package( 'com.neuromantic.arete.transitions',
 	_import( 'com.neuromantic.arete.fx.Timer' ),
 	_import( 'com.neuromantic.arete.fx.Easing' ),
 	_import( 'com.neuromantic.arete.events.TweenEvent' ),
 	
	_class( 'Tween' )._extends( 'Timer', {
		static_SPECIAL_PROPERTIES : [ 'delay', 'onStart', 'onUpdate', 'onComplete', 'onStop', 'scope' ],
		static_frameRate : 100,
		static_defaultEasing : Easing.easeInOutQuad,
		private_toProperties : null,
		private_tweenDuration : 0,
		private_startTime : 0,
		private_context : null,
		private_easing : null,
		static_to : function( target, duration, properties ) {
			return new Tween( target, duration, properties );
		},
		static_delayedCall : function( delay, toCall ) {
			return new Tween( 'delayedCall' , 0, { delay : delay, onComplete : toCall } );
		},
		static_delta : function( target, duration, properties ) {
			var deltaProperties = {};
			for ( var propertyName in properties ) {
				if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
					deltaProperties[ propertyName ] = Number( target._get( propertyName ) + properties[ propertyName ]);
				}else{
					deltaProperties[ propertyName ] = properties[ propertyName ];
				}
			}
			return new Tween( target, duration, deltaProperties );
		},
		static_from : function( target, duration, properties ) {
			var originalProperties = {};
			for ( var propertyName in properties ) {
					originalProperties[ propertyName ] = target._get( propertyName );
				if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
					target._set( propertyName , properties[ propertyName ] );
				}else{
					originalProperties[ propertyName ] = properties[ propertyName ];
				}
			}
			return new Tween( target, duration, originalProperties );
		},
		Tween : function( target, duration, properties ) {
			this._super( 1000 / Tween.frameRate );
			this.on( TimerEvent.TIMER, this._.updateTween );
			this._.target = target;
			this._.tweenDuration = duration;
			this._.toProperties = properties;
			this._.easing = properties.easing || Tween.defaultEasing;
			this._.fromProperties = {};
			if( properties.onComplete ) {
					this.on( TweenEvent.COMPLETE, properties.onComplete );
			}
            if( properties.onStart ) {
					this.on( TweenEvent.START, properties.onStart );
            }
            if( properties.onUpdate ) {
					this.on( TweenEvent.UPDATE, properties.onUpdate ); 
            }
            if( properties.delay ) {
				  this._.delayTimer = new Timer( properties.delay * 1000, 1 );
				  this._.delayTimer.on( TimerEvent.COMPLETE, this.startTween );
				  this._.delayTimer.start();
				  delete properties.delay;
            }else{
				  this.startTween();
            }
			
		},
	 	private_currentTime : function () {
			  return Date.now() * 0.001;
	  	},
		private_elapsedTime : function () {
            return this._.currentTime() - this._.startTime;
		},
        kill : function ( finish ) {
            if( this._.delayTimer ){
                this._.delayTimer.stop();
                this._.delayTimer = null;
            }
            this.stopTween( finish );
		},
        private_delayTimer : null,
        startTween : function () {
            this._dispatchEvent( new TweenEvent( TweenEvent.START , this ) );
			this._.startTime = this._.currentTime();
			for ( var propertyName in this._.toProperties ) {
				if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
					this._.fromProperties[ propertyName ] = this._.target._get( propertyName );
				}
			}
			if ( this.tweenDuration === 0 ) {
				this._.updateTween();
			}
			this.start();
		},
		private_updateTween : function () {
			this._dispatchEvent( new TweenEvent( TweenEvent.UPDATING , this ) );
			var previousValues  = {};
			for ( var propertyName in this._.toProperties ) { //all equations use this signature  t: current time, b: beginning value, c: change in value, d: duration
					if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
						var newValue = this._.easing( this._.elapsedTime(), this._.fromProperties[ propertyName ], this._.toProperties[ propertyName ] - this._.fromProperties[ propertyName ], this._.tweenDuration );
						previousValues[ propertyName ] = this._.target._get(propertyName);
						this._.target._set( propertyName , newValue );
					}
				}
				this._dispatchEvent( new TweenEvent( TweenEvent.UPDATE , this, previousValues ) );
				if( this._.elapsedTime() >= this._.tweenDuration ) {
					return this.stopTween( true );
				}
			},
			stopTween : function ( finish ) {
                if( finish ) {
                    for( var propertyName in this._.toProperties ) {
                        if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
                            this._.target._set( propertyName , this._.toProperties[ propertyName ] );
                        }
                    }
                }
			  this._.notify( new TweenEvent( TweenEvent.COMPLETE ) );
			  this.stop();
		  }//,
	})
);

			
			
		