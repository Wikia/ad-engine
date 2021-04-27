import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';
import { isArray } from 'util';

const logGroup = 'RealVu';

class RealVu {
	private loadingStatus = '';

	constructor() {
		communicationService.action$
			.pipe(ofType(globalAction('[AdEngine] Prebid bids requested', props<{}>())))
			.subscribe(() => {
				if (this.loadingStatus === 'calling') {
					utils.logger(logGroup, 'too late while calling Prebid');
					this.updateSlotsTargeting('late');
				}
			});

		communicationService.action$
			.pipe(ofType(globalAction('[AdEngine] Ad queue started', props<{}>())))
			.subscribe(() => {
				if (this.loadingStatus === 'calling') {
					utils.logger(logGroup, 'not available while calling GAM');
					this.updateSlotsTargeting('na');
				}
			});
	}

	call(): Promise<void> {
		const id: string = context.get('services.realVu.id');

		if (!context.get('services.realVu.enabled') || !id) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//ac.realvu.net/flip/2/${id}`;

		utils.logger(logGroup, 'calling', libraryUrl);
		this.loadingStatus = 'calling';

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'ready');
			this.loadingStatus = 'ready';

			if (top.realvu_aa) {
				this.updateSlotsTargeting('response');
			}
		});
	}

	private updateSlotsTargeting(state: string): void {
		Object.keys(context.get('slots') || {}).forEach((slotName) => {
			const key = `slots.${slotName}.targeting.realvu`;

			if (!isArray(context.get(key))) {
				context.set(key, []);
			}

			context.push(key, state === 'response' ? top.realvu_aa.regUnit(slotName) : state);
		});
	}
}

export const realVu = new RealVu();
