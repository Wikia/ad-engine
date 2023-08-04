import { BaseServiceSetup, slotService, targetingService, utils } from '@ad-engine/core';

const logGroup = 'double-verify';
const scriptUrl = 'https://pub.doubleverify.com/signals/pub.json';
const ctx = '28150781';
const cmp = 'DV1001654';
const userAgent = 'ad-engine';
const referer = 'https://fandom.com';

interface AdUnit {
	path: string;
	sizes: string[];
}

export class DoubleVerify extends BaseServiceSetup {
	async call() {
		if (!this.isEnabled('icDoubleVerify')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		const slots = this.getSlots();
		const url = this.prepareURL(slots);
		const headers = this.getHeaders();

		try {
			const response = await fetch(url.href, { headers });
			if (!response.ok) {
				utils.logger(logGroup, 'Error fetching signals:');
				return;
			}

			const signals = await response.json();
			this.prepareTargeting(signals);
		} catch (error) {
			utils.logger(logGroup, 'Error fetching signals', error);
		}
	}

	private prepareTargeting(data: any) {
		utils.logger(logGroup, 'setting targeting');
		targetingService.set('ids', data['IDS']?.toString());
		targetingService.set('bsc', data['BSC']);
		targetingService.set('abs', data['ABC']?.toString());
	}

	private getHeaders() {
		return {
			referer,
			'user-agent': userAgent,
		};
	}

	private prepareURL(slots: AdUnit[]) {
		const params = new URLSearchParams({
			ctx,
			cmp,
			url: encodeURIComponent(referer),
		});

		for (const slot of slots) {
			params.append(`adunits[${slot.path}][]`, slot.sizes.join(','));
		}

		const url = new URL(scriptUrl);
		url.search = params.toString();

		return url;
	}

	private getSlots(): AdUnit[] {
		return Object.entries(slotService.slotConfigsMap)
			.filter(([, value]) => Array.isArray(value?.defaultSizes))
			.map(([key, value]) => {
				return {
					path: key,
					sizes: this.mapSizes(value.defaultSizes),
				};
			});
	}

	private mapSizes(adSlotSizes: any): string[] {
		const sizes: string[] = [];

		if (!Array.isArray(adSlotSizes)) {
			return sizes;
		}

		Object.values(adSlotSizes)
			.filter((value) => Array.isArray(value) && value.length === 2)
			.forEach((value) => {
				sizes.push(`${value[0]}x${value[1]}`);
			});

		return sizes;
	}
}
