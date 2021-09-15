import { context } from '../services';
import { logger } from '../utils';

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

		Object.keys(context.get('slots') || []).forEach((slotName) =>
			this.setSlotTargeting(slotName, this.statusResolver(slotName)),
		);
	}

	getSlotTargeting(slotName: string): Status[] {
		return context.get(`slots.${slotName}.targeting.realvu`);
	}

	updateSlotTargeting(slotName: string): void {
		if (this.isEnabled() && window.realvu_aa) {
			const status = window.realvu_aa.getStatusById(slotName);
			this.setSlotTargeting(slotName, status);
		}
	}

	private statusResolver(slotName: string): Status {
		return window.realvu_aa?.addUnitById(
			{
				partner_id: 'E6H4',
				unit_id: slotName,
				mode: 'kvp',
			} || 'na',
		);
	}

	private setSlotTargeting(slotName: string, status: Status): void {
		context.set(`slots.${slotName}.targeting.realvu`, [status]);
	}

	private isEnabled(): boolean {
		return context.get('services.realVu.enabled') && context.get('services.realVu.partnerId');
	}
}

export const realVu = new RealVu();
