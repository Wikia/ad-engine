import { context, DiProcess, registerCustomAdLoader, targetingService } from '@wikia/ad-engine';

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		targetingService.set('skin', 'tvguide-mtc');

		registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
	}
}
