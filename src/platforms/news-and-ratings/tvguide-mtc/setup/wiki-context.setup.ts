import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class TvGuideMTCContextSetup implements DiProcess {
	execute(): void {
		context.set('services.instantConfig.endpoint', 'https://services.fandom.com');
		context.set('services.instantConfig.appName', 'tvguide-mtc');
		targetingService.set('skin', 'tvguide-mtc');
	}
}
