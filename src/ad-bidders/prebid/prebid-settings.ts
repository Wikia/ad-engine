import { adaptersRegistry } from './adapters-registry';

export function createAdapterSpecificSettings(adaptersList): PrebidSettings | undefined {
	const adaptersAdServerTargeting = {};

	adaptersList.forEach(({ bidderName }) => {
		if (!bidderName) {
			return;
		}

		adaptersAdServerTargeting[bidderName] = {
			adserverTargeting: [
				{
					key: `hb_deal_${bidderName}`,
					val: ({ dealId }) => {
						return dealId;
					},
				},
			],
			suppressEmptyKeys: true,
			allowZeroCpmBids: true,
		};
	});

	return adaptersAdServerTargeting;
}

export function getSettings(): PrebidSettings {
	return {
		standard: {
			suppressEmptyKeys: true,
			allowZeroCpmBids: true,
		},
		...createAdapterSpecificSettings(adaptersRegistry.getAdapters()),
	};
}
