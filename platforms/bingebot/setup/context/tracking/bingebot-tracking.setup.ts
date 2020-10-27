import { TrackingSetup } from '@platforms/shared';
import { communicationService, context, ofType } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { shareReplay } from 'rxjs/operators';
import { viewRendered } from '../../../setup-bingebot';

@Injectable()
export class BingeBotTrackingSetup extends TrackingSetup {
	execute(): void {
		communicationService.action$
			.pipe(
				ofType(viewRendered),
				shareReplay(1), // take only the newest value
			)
			.subscribe((action) => {
				context.set('wiki', {
					beaconId: action.beaconId,
					pvNumber: action.pvNumber,
					pvNumberGlobal: action.pvNumberGlobal,
					pvUID: action.pvUID,
					sessionId: action.sessionId,
				});
			});

		return super.execute();
	}
}
