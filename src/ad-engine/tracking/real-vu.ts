import { context } from '../services';
import { logger } from '../utils';

type Status = 'yes' | 'no' | 'na';
const logGroup = 'real-vu';

class RealVu {
	enableAnalytics(pbjs: Pbjs): void {
		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return;
		}

		pbjs.enableAnalytics({
			provider: 'realvuAnalytics',
			options: {
				partnerId: context.get('services.realVu.partnerId'),
				reqAllUnits: true,
			},
		});
	}

	setInitialTargeting(): void {
		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return;
		}

		Object.keys(context.get('slots') || []).forEach((slotName) => {
			if (window.realvu_aa) {
				const status =
					window.realvu_aa.addUnitById({
						partner_id: 'E6H4',
						unit_id: slotName,
						mode: 'kvp',
					}) || 'na';

				context.set(`slots.${slotName}.targeting.realvu`, [status]);
			} else {
				context.set(`slots.${slotName}.targeting.realvu`, ['too_late']);
			}
		});
	}

	getSlotTargeting(slotName: string): Status[] {
		return context.get(`slots.${slotName}.targeting.realvu`);
	}

	updateSlotTargeting(slotName: string): void {
		if (this.isEnabled() && window.realvu_aa) {
			const realvu = window.realvu_aa.getStatusById(slotName);
			context.set(`slots.${slotName}.targeting.realvu`, [realvu]);
		}
	}

	private isEnabled(): boolean {
		return !!context.get('services.realVu.enabled') && !!context.get('services.realVu.partnerId');
	}
}

export const realVu = new RealVu();
