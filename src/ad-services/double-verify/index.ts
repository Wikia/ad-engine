import { context, SlotConfig, targetingService } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, stringBuilder } from '@ad-engine/utils';

const logGroup = 'double-verify';
const scriptUrl = 'https://pub.doubleverify.com/signals/pub.json';
const ctx = '28150781';
const cmp = 'DV1001654';
const referer = window.location.href;

interface AdUnit {
	slotName: string;
	path: string;
}

export class DoubleVerify extends BaseServiceSetup {
	private isLoaded = false;
	private slots: string[] = [];
	private adUnits: AdUnit[] = [];

	async call() {
		if (this.isLoaded) {
			return;
		}

		if (!this.isEnabled('icDoubleVerify')) {
			logger(logGroup, 'disabled');
			return;
		}

		this.slots = context.get('services.doubleVerify.slots');

		if (!this.slots) {
			logger(logGroup, 'Empty slots configuration');
			return;
		}

		this.setInitialTargeting();

		try {
			const url = this.prepareRequestURL();
			const headers = this.getRequestHeaders();
			const response = await fetch(url.href, { headers });

			if (!response.ok) {
				throw new Error('Error fetching signals');
			}

			const signals = await response.json();
			this.isLoaded = true;
			this.setTargeting(signals);
		} catch (error) {
			logger(logGroup, 'Error fetching signals', error);
		}

		return;
	}

	private setInitialTargeting(): void {
		targetingService.set('ids', '-1');
		targetingService.set('bsc', '-1');
		targetingService.set('abs', '-1');

		this.slots.forEach((slotName) => {
			targetingService.set('tvp', '-1', slotName);
			targetingService.set('vlp', '-1', slotName);
		});
	}

	private setTargeting(data: any): void {
		logger(logGroup, 'Setting targeting', data);
		targetingService.set('ids', data['IDS']?.toString());
		targetingService.set('bsc', data['BSC']);
		targetingService.set('abs', data['ABS']?.toString());

		this.addToSlotsTargeting(data['TVP'], 'tvp');
		this.addToSlotsTargeting(data['VLP'], 'vlp');
	}

	private addToSlotsTargeting(data: any, targetingKey: string): void {
		if (typeof data === 'object') {
			Object.entries(data).forEach(([adUnitPath, value]) => {
				const adUnit: AdUnit | undefined = this.adUnits.find(
					(adUnit) => adUnit.path === adUnitPath,
				);
				const slotName = adUnit?.slotName ?? '';

				targetingService.set(targetingKey, value[''], slotName);
			});
		}
	}

	private getRequestHeaders(): any {
		return {
			referer,
			'user-agent': window.navigator.userAgent,
		};
	}

	private prepareRequestURL(): URL {
		const params = new URLSearchParams({
			ctx,
			cmp,
			url: encodeURIComponent(referer),
		});

		this.adUnits = this.getAdUnitsForRequest();

		Object.values(this.adUnits).forEach(({ path }) => {
			params.append(`adunits[${path}][]`, '');
		});

		const url = new URL(scriptUrl);
		url.search = params.toString();

		return url;
	}

	private getAdUnitsForRequest(): AdUnit[] {
		return this.slots.map((slotName) => {
			const slotConfig: SlotConfig = { ...context.get(`slots.${slotName}`) };
			slotConfig.slotNameSuffix = slotConfig.slotNameSuffix || '';

			const adUnitPath = stringBuilder.build(slotConfig.adUnit || context.get('adUnitId'), {
				slotConfig,
			});

			return {
				slotName,
				path: adUnitPath,
			};
		});
	}
}
