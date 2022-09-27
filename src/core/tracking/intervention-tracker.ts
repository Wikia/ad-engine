import {
	AdIntervention,
	communicationService,
	eventsRepository,
	ofType,
} from '@ad-engine/communication';
import { tap } from 'rxjs/operators';
import { AdSlot } from '../models';
import { context, externalLogger, slotService } from '../services';
import { logger } from '../utils';

const heavyAdIntervention = 'HeavyAdIntervention';
const logGroup = 'intervention-tracker';

class InterventionTracker {
	register(): void {
		if (!context.get('services.interventionTracker.enabled')) {
			logger(logGroup, 'Intervention tracker is disabled');
			return;
		}

		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.GAM_AD_INTERVENTION)),
				tap((intervention: AdIntervention) => this.handleIntervention(intervention)),
			)
			.subscribe();
	}

	private handleIntervention(intervention: AdIntervention): void {
		const adSlot: AdSlot = slotService.get(intervention.slotName);

		logger(logGroup, intervention);

		if (adSlot) {
			adSlot.setStatus(this.getInterventionStatus(intervention.id));

			externalLogger.log('Ad intervention', {
				interventionId: intervention.id,
				interventionMessage: intervention.message,
				lineItemId: adSlot.lineItemId,
				slotName: intervention.slotName,
			});
		}
	}

	private getInterventionStatus(id: string): string {
		switch (id) {
			case heavyAdIntervention:
				return AdSlot.STATUS_HEAVY_AD_INTERVENTION;
			default:
				return AdSlot.STATUS_UNKNOWN_INTERVENTION;
		}
	}
}

export const interventionTracker = new InterventionTracker();
