import { BaseServiceSetup, slotService, targetingService, utils } from '@ad-engine/core';

const logGroup = 'double-verify';
const scriptUrl = 'http:////pub.doubleverify.com/signals/pub.json';
const ctx = '28150781';
const cmp = 'DV1001654';
const referer = window.location.href;

interface AdUnit {
	path: string;
}

export class DoubleVerify extends BaseServiceSetup {
	private isLoaded = false;

	async call() {
		if (this.isLoaded) {
			return;
		}

		if (!this.isEnabled('icDoubleVerify', false)) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		const slots = this.getSlots();
		const url = this.prepareRequestURL(slots);
		const headers = this.getRequestHeaders();

		try {
			const response = await fetch(url.href, { headers });

			if (!response.ok) {
				utils.logger(logGroup, 'Error fetching signals');
				return;
			}

			const signals = await response.json();
			this.isLoaded = true;
			this.prepareTargeting(signals);
		} catch (error) {
			utils.logger(logGroup, 'Error fetching signals', error);
		}

		return;
	}

	private prepareTargeting(data: any) {
		utils.logger(logGroup, 'Setting targeting', data);
		targetingService.set('ids', data['IDS']?.toString());
		targetingService.set('bsc', data['BSC']);
		targetingService.set('abs', data['ABC']?.toString());

		this.addToSlotsTargeting(data['TVP'], 'tvp');
		this.addToSlotsTargeting(data['VLP'], 'vlp');
	}

	private addToSlotsTargeting(data: any, targetingKey: string) {
		if (typeof data === 'object') {
			Object.entries(data).forEach(([slotName, value]) => {
				targetingService.set(targetingKey, value[''], slotName);
			});
		}
	}

	private getRequestHeaders() {
		return {
			referer,
			'user-agent': window.navigator.userAgent,
		};
	}

	private prepareRequestURL(slots: AdUnit[]) {
		const params = new URLSearchParams({
			ctx,
			cmp,
			url: encodeURIComponent(referer),
		});

		Object.entries(slots).forEach(([, slot]) => {
			params.append(`adunits[${slot.path}][]`, '');
		});

		const url = new URL(scriptUrl);
		url.search = params.toString();

		return url;
	}

	private getSlots(): AdUnit[] {
		return Object.entries(slotService.slotConfigsMap).map(([key]) => {
			return {
				path: key,
			};
		});
	}
}
