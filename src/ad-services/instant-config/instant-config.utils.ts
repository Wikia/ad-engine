import { utils } from '@ad-engine/core';
import { InstantConfigResult } from './instant-config.models';

const instantGlobalsQueryParamPrefix = 'InstantGlobals';

export const overrideInstantConfig = (config: InstantConfigResult): InstantConfigResult => {
	const newConfig = {};
	const queryParams = utils.queryString.getValues();

	Object.keys(queryParams)
		.filter((instantGlobalKey: string) => {
			return instantGlobalKey.indexOf(instantGlobalsQueryParamPrefix) === 0;
		})
		.map((instantGlobalKey) => {
			const [, key] = instantGlobalKey.split('.');

			return {
				instantGlobalKey,
				key,
			};
		})
		.forEach(({ instantGlobalKey, key }) => {
			newConfig[key] = utils.queryString.parseValue(queryParams[instantGlobalKey]);
		});

	return { ...config, ...newConfig };
};
