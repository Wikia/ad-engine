import { context, registerCustomAdLoader, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		targetingService.set('skin', 'tvguide-mtc');

		context.set('state.provider', 'nothing');
		context.set('state.external.adengine', 'mtc');

		registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
	}
}
