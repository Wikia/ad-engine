import { adaptersRegistry } from './adapters-registry';

export function createAdapterSpecificSettings(adaptersList): PrebidSettings | undefined {
	const adaptersSettings = {};

	adaptersList.forEach(({ bidderName, bidderSettings, aliases }) => {
		if (!bidderName) {
			return;
		}

		const replaceFirstEmptyConfigurationForAlias = () => {
			if (typeof aliases === 'object') {
				Object.keys(aliases)
					.filter((alias) => !adaptersSettings[alias])
					.forEach((alias) => (adaptersSettings[alias] = settings));
			}
		};

		let settings = {
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

		if (bidderSettings) {
			settings = { ...settings, ...bidderSettings };
		}

		adaptersSettings[bidderName] = settings;

		replaceFirstEmptyConfigurationForAlias();
	});

	return adaptersSettings;
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
