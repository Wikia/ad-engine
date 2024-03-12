import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { context, InstantConfigService, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { logger, targeting } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';
import { createFandomContext } from './targeting-strategies/factories/create-fandom-context';
import { createOpenRtb2Context } from './targeting-strategies/factories/create-open-rtb2-context';
import { createSelectedStrategy } from './targeting-strategies/factories/create-selected-strategy';
import { TargetingTags } from './targeting-strategies/interfaces/taxonomy-tags';
import { FandomContext } from './targeting-strategies/models/fandom-context';

@Injectable()
export class UcpTargetingSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		const fandomContext = createFandomContext();

		targetingService.extend({
			...targetingService.dump(),
			...this.getPageLevelTargeting(fandomContext),
		});

		if (context.get('wiki.opts.isAdTestWiki') && context.get('wiki.targeting.testSrc')) {
			context.set('src', [context.get('wiki.targeting.testSrc')]);
		} else if (context.get('wiki.opts.isAdTestWiki')) {
			context.set('src', ['test']);
		}

		if (context.get('options.uapExtendedSrcTargeting')) {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					if (action.isLoaded || action.adProduct === 'ruap') {
						context.push('src', 'uap');
					}
				},
			);
		}

		if (context.get('wiki.targeting.wikiIsTop1000')) {
			context.set('custom.wikiIdentifier', '_top1k_wiki');
			context.set('custom.dbNameForAdUnit', targetingService.get('s1'));
		}

		targetingService.set(
			'bundles',
			targeting.getTargetingBundles(this.instantConfig.get('icTargetingBundles')),
		);

		if (this.instantConfig.get<boolean>('icOpenRtb2Context')) {
			targetingService.set('openrtb2', createOpenRtb2Context(fandomContext), 'openrtb2');
		}
	}

	private getPageLevelTargeting(fandomContext: FandomContext): TargetingTags {
		const selectedStrategy: string = this.instantConfig.get('icTargetingStrategy');

		logger('Targeting', `Selected targeting priority strategy: ${selectedStrategy}`);

		return createSelectedStrategy(selectedStrategy, fandomContext).get();
	}
}
