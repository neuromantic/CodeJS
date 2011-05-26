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
			static_SPECIAL_PROPERTIES : [ 'delay', 'onStart', 'onUpdate', 'onComplete', 'context', 'onStop' ],
			static_frameRate : 100,
			static_defaultEasing : Easing.easeInOutQuad,
			
			private_toProperties : null,
			private_tweenDuration : 0,
			private_startTime : 0,
			private_context : null,
			private_easing : null,
			
			static_to : function( target, duration, properties ) {
// _trace( 'Tween.to', target, duration, properties );
				var tween = new Tween( target, duration, properties );
			},
			
			static_delayedCall : function( delay, toCall, context ) {
				var tween = new Tween( null , 0, { delay : delay, onComplete : toCall, context : context } );
			},
			
			static_delta : function( target, duration, properties ) {
				var deltaProperties = {};
				for ( var propertyName in properties ) {
					if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
						deltaProperties[ propertyName ] = Number( target._get( propertyName ) + properties[ propertyName ]);
					}else{
						deltaProperties[ propertyName ] = properties[ propertyName ];
					};
				};
				var tween = new Tween( target, duration, deltaProperties );
			},

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
				this.addEventListener( TimerEvent.TIMER, this._timerHandler );
				this._super( 1000 / Tween.frameRate );
				this._.target = target;
				this._.tweenDuration = duration;
				this._.toProperties = properties;
				this._.easing = properties.easing || Tween.defaultEasing;
				this._.fromProperties = {};
				var _properties = properties;
				if( properties.context ) {
					this._.context = properties.context;
				};
				var _context = this._.context;
				if( properties.onComplete ) {
						this.addEventListener( TweenEvent.COMPLETE, function( event ) {
							properties.onComplete.apply( _context, [ event ] ); 
						});
					// delete this.toProperties.onComplete ;
				};
				 if( properties.onStart ) {
						  this.addEventListener( TweenEvent.START, function( event ) {
						 	 properties.onStart.apply( _context, [ event ] );
						  });
					 // delete this.toProperties.onStart  ;
				 };
				  if( properties.onUpdate ) {
						   this.addEventListener( TweenEvent.UPDATE, function( event ) {
						  	  properties.onUpdate.apply( context, [event] ); 
						   });
					  // delete this.toProperties.onUpdate ;
				  };
				  if( properties.delay ) {
					  this._.delayTimer = new Timer( properties.delay * 1000, 1 );
					  var _this = this;
					  this._.delayTimer.addEventListener( TimerEvent.COMPLETE, function() { _this.startTween() } );
  // _trace('delaying tween of', this._.target );
					  this._.delayTimer.start();
					  delete properties.delay;
				  }else{
					  this.startTween();
				  };
 				
			},
			  _currentTime : function () {
				  // var seconds = seconds
				  return Date.now() * 0.001;
			  },
  			
			  _elapsedTime : function () {
				  return this._currentTime() - this._.startTime;
			  },
  			
			  kill : function ( finish ) {
				  if( this._.delayTimer ){
					  this._.delayTimer.stop();
					  this._.delayTimer = null;
				  }
				  this.stopTween( finish )
			  },
  			
			  private_delayTimer : null,
			  _timerHandler : function( event ){
				  event.target.updateTween();
			  },
  			
			  startTween : function () {
  // _trace( 'starting tween of', this._.target );
				  this._dispatchEvent( new TweenEvent( TweenEvent.START , this ) );
				  this._.startTime = this._currentTime();
				  for ( var propertyName in this._.toProperties ) {
					  if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
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
  // _trace( 'updating tween of', this._.target );
				  this._dispatchEvent( new TweenEvent( TweenEvent.UPDATING , this ) );
				  var previousValues  = {};
				  for ( var propertyName in this._.toProperties ) { //all equations use this signature  t: current time, b: beginning value, c: change in value, d: duration
					  if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
						  var newValue = this._.easing( this._elapsedTime(), this._.fromProperties[ propertyName ], this._.toProperties[ propertyName ] - this._.fromProperties[ propertyName ], this._.tweenDuration );
						  previousValues[ propertyName ] = this._.target._get(propertyName);
						  this._.target._set( propertyName , newValue );
  // _trace( String( this._elapsedTime() ).substr(0,5),'s', this._.target, propertyName, ':',previousValues[ propertyName ], '-->', this._.target._get( propertyName ) );
					  }
				  };
				  this._dispatchEvent( new TweenEvent( TweenEvent.UPDATE , this, previousValues ) );
				  if( this._elapsedTime() >= this._.tweenDuration ) {
					  return this.stopTween( true );
				  };
			  },
			  stopTween : function ( finish ) {
  // _trace( 'stopping tween of', this._.target );
				  if( finish ) {
					  for( var propertyName in this._.toProperties ) {
						  if( Tween.SPECIAL_PROPERTIES.indexOf( propertyName ) < 0 ){
							  this._.target._set( propertyName , this._.toProperties[ propertyName ] );
						  }
					  };
				  };
				  this._dispatchEvent( new TweenEvent( TweenEvent.COMPLETE , this ) );
				  this.stop();
			  }//,
		});

			
			
		