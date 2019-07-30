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
		.map((paramKey) => {
			const [, key] = paramKey.split('.');

			return {
				paramKey,
				key,
			};
		})
		.map(({ paramKey, key }) => ({
			key,
			value: utils.queryString.parseValue(queryParams[paramKey]),
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
