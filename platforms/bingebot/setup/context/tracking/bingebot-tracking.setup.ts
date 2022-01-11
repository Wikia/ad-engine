import { TrackingSetup } from '@platforms/shared';
import { communicationService, context, eventsRepository, ofType } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class BingeBotTrackingSetup extends TrackingSetup {
	execute(): void {
		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.BINGEBOT_VIEW_RENDERED)),
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
