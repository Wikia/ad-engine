import {
	communicationService,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	ofType,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';
import { filter, take } from 'rxjs/operators';
import { DetectorFactory } from './detector-factory';

@Injectable()
export class SequentialMessagingSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	async execute(): Promise<void> {
		interface Action {
			event: string;
			slot: { lineItemId: string };
		}

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)),
				filter((action: Action) => action.event === 'slotShowed'),
				take(1),
			)
			.subscribe((action) => {
				// TODO extract and test this

				const lineItemId = action.slot.lineItemId;
				if (lineItemId == null) {
					return;
				}

				const icbmLineItems: IcSequentialMessaging = this.instantConfig.get(
					'icSequentialMessaging',
				);
				// TODO validate ICBM input
				const sequenceDetector = new DetectorFactory(icbmLineItems).makeSequenceDetector();

				if (sequenceDetector.isAdSequential(lineItemId.toString())) {
					Cookies.set('sequential_messaging', {
						lineItemId: { length: icbmLineItems[lineItemId].length },
					});
				}
			});
	}
}
