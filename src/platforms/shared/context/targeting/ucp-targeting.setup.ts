import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	TargetingData,
	targetingService,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { createFandomContext } from './targeting-strategies/factories/create-fandom-context';
import { createSelectedStrategy } from './targeting-strategies/factories/create-selected-strategy';
import { TargetingTags } from './targeting-strategies/interfaces/taxonomy-tags';

@Injectable()
export class UcpTargetingSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		targetingService.extend({
			...targetingService.dumpTargeting(),
			...this.getPageLevelTargeting(),
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
			context.set('custom.dbNameForAdUnit', targetingService.dumpTargeting<TargetingData>().s1);
		}

		targetingService.set(
			'bundles',
			utils.targeting.getTargetingBundles(this.instantConfig.get('icTargetingBundles')),
		);
	}

	private getPageLevelTargeting(): TargetingTags {
		const selectedStrategy: string = this.instantConfig.get('icTargetingStrategy');

		utils.logger('Targeting', `Selected targeting priority strategy: ${selectedStrategy}`);

		return createSelectedStrategy(selectedStrategy, createFandomContext()).get();
	}
}
