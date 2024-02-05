import { TrackingSetup } from '@platforms/shared';
import { communicationService, context, eventsRepository } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotTrackingSetup extends TrackingSetup {
	execute(): void {
		communicationService.once(
			communicationService.getGlobalAction(eventsRepository.BINGEBOT_VIEW_RENDERED),
			(action) => {
				context.set('wiki', {
					beaconId: action.beaconId,
					pvNumber: action.pvNumber,
					pvNumberGlobal: action.pvNumberGlobal,
					pvUID: action.pvUID,
					sessionId: action.sessionId,
				});
			},
		);

		return super.execute();
	}
}
