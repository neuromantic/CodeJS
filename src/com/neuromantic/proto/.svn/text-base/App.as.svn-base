package net.kolektiv.proto {
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import br.com.stimuli.loading.BulkLoader;
	import net.kolektiv.utils.CSS;
	
	public class App extends ExecSprite {
		protected var css:CSS = new CSS();
		protected var loader:BulkLoader = new BulkLoader( BulkLoader.getUniqueName() );
		public function App() {
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.addEventListener( Event.RESIZE, stage_resizeHandler );
			super();
		}
		override protected function setup():void {
		}
		private function stage_resizeHandler( event:Event ):void {
			layout();
		}
	}
}