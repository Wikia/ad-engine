import { context, InstantConfigService } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { GlobalTimeout } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class JwpStrategyRulesSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: GlobalTimeout,
	) {
		super(instantConfig, globalTimeout);
	}

	call() {
		context.set(
			'options.video.enableStrategyRules',
			this.instantConfig.get('icFeaturedVideoPlayer') === 'jwp-strategy-rules',
		);
		this.addMediaIdToContextWhenStrategyRulesEnabled();
	}

	private addMediaIdToContextWhenStrategyRulesEnabled() {
		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (!strategyRulesEnabled) {
			return;
		}

		context.set(
			'options.video.jwplayer.initialMediaId',
			window?.mw?.config?.get('wgArticleFeaturedVideo')?.mediaId,
		);
	}
}
