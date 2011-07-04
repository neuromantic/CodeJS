package net.kolektiv.proto.mvc {
	import flash.events.EventDispatcher;
	
	public class Model extends EventDispatcher {
		public var parent:Model;
		private var _ready:Boolean = false;
		public function get ready():Boolean {
			return _ready
		}
		public function set ready( value:Boolean ):void {
			for each ( var subModel:Model in subModels ) {
				if ( !subModel.ready ) {
					subModel.ready = value;
				}
			}
			_ready = value;
			if ( _ready ) {
				var event:MVCEvent = new MVCEvent( MVCEvent.READY );
				dispatchEvent( event );
			}
		}
		public function get root():Model {
			var elder:Model = parent;
			if ( elder ) {
				while ( elder.parent ) {
					elder = elder.parent;
				}
			}
			return elder;
		}
		protected var subModels:Vector.<Model> = new Vector.<Model>();
		private var updateCount:int = 0;
		public function Model() {
			super();
		}
		protected function addSubModel( childModel:Model ):void {
			if ( subModels.indexOf( childModel ) == -1 ) {
				subModels.push( childModel );
			}
			if ( ready ) {
				childModel.ready = true;
			}
			childModel.parent = this;
		}
		protected function removeSubModel( childModel:Model ):void {
			childModel.parent = null;
			if ( subModels.indexOf( childModel ) > -1 ) {
				subModels.splice( subModels.indexOf( childModel ), 1 );
			}
		}
		protected function update():void {
			if ( ready ) {
				var event:MVCEvent = new MVCEvent( MVCEvent.UPDATE );
				dispatchEvent( event );
			}
			if ( parent ) {
				parent.update();
			}
		}
	}
}