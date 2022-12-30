import { Injectable } from '@wikia/dependency-injection';

import {
	BaseContextSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
} from '@platforms/shared';
import { context, ProcessPipeline, utils } from '@wikia/ad-engine';

import { basicContext } from './ad-context';

import { MetacriticAdsMode } from './modes/metacritic-ads-mode';
import { MetacriticPrebidConfigSetup } from './setup/context/prebid/metacritic-prebid-config.setup';
import { MetacriticSlotsContextSetup } from './setup/context/slots/metacritic-slots-context.setup';
import { MetacriticDynamicSlotsSetup } from './setup/dynamic-slots/metacritic-dynamic-slots.setup';

@Injectable()
export class MetacriticPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			BaseContextSetup,
			MetacriticDynamicSlotsSetup,
			MetacriticSlotsContextSetup,
			BiddersStateSetup,
			MetacriticPrebidConfigSetup,
			MetacriticAdsMode,
		);

		this.pipeline.execute();
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}
}
