import { utils } from '@ad-engine/core';
import {
	InstantConfigGroup,
	InstantConfigResponse,
	InstantConfigValue,
} from './instant-config.models';

const instantGlobalsQueryParamPrefix = 'InstantGlobals';

export function overrideInstantConfig(config: InstantConfigResponse): InstantConfigResponse {
	const queryParams = utils.queryString.getValues();

	return Object.keys(queryParams)
		.filter((paramKey: string) => paramKey.startsWith(instantGlobalsQueryParamPrefix))
		.map((instantGlobalKey) => {
			const [, key] = instantGlobalKey.split('.');

			return {
				instantGlobalKey,
				key,
			};
		})
		.map(({ instantGlobalKey, key }) => ({
			key,
			value: utils.queryString.parseValue(queryParams[instantGlobalKey]),
		}))
		.map(({ key, value }) => ({
			key,
			value: key.startsWith('wgAdDriver') ? value : wrapValueInXXRegions(value),
		}))
		.reduce((newConfig, { key, value }) => ({ ...newConfig, [key]: value }), config);
}

function wrapValueInXXRegions(value: InstantConfigValue): InstantConfigGroup[] {
	return [
		{
			value,
			regions: ['XX'],
		},
	];
}
