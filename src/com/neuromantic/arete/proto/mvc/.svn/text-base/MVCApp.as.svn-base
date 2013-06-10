package net.kolektiv.proto.mvc {
	import net.kolektiv.proto.App;
	
	public class MVCApp extends App {
		protected var controller:Controller;
		protected var model:Model;
		public function MVCApp() {
			super();
		}
		override public function exec():void {
			model.addEventListener( MVCEvent.UPDATE, model_updateHandler );
			model.addEventListener( MVCEvent.READY, model_readyHandler );
		}
		protected function model_updateHandler( event:MVCEvent ):void {
			layout();
		}
		private function model_readyHandler( event:MVCEvent ):void {
			super.exec();
		}
	}
}