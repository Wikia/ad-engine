import { utils } from '@ad-engine/core';
import {
	InstantConfigGroup,
	InstantConfigResponse,
	InstantConfigValue,
} from './instant-config.models';

const queryParamPrefixes = ['InstantGlobals', 'icbm'];

function hasInstantConfigPrefix(key: string): boolean {
	return queryParamPrefixes.filter((prefix: string) => key.startsWith(`${prefix}.`)).length > 0;
}

export class InstantConfigOverrider {
	override(config: InstantConfigResponse): InstantConfigResponse {
		const queryParams = utils.queryString.getValues();

		return Object.keys(queryParams)
			.filter((paramKey: string) => hasInstantConfigPrefix(paramKey))
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
				value: key.startsWith('wg') ? value : this.wrapValueInXXRegions(value),
			}))
			.reduce((newConfig, { key, value }) => ({ ...newConfig, [key]: value }), config);
	}

	private wrapValueInXXRegions(value: InstantConfigValue): InstantConfigGroup[] {
		return [
			{
				value,
				regions: ['XX'],
			},
		];
	}
}
