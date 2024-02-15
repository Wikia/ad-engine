import { context, DiProcess, registerCustomAdLoader, targetingService } from '@wikia/ad-engine';

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		targetingService.set('skin', 'tvguide-mtc');

		context.set('state.provider', 'nothing');
		context.set('state.external.adengine', 'mtc');

		registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
	}
}
