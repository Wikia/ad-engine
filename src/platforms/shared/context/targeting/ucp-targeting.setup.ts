import {
	Binder,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	GlobalTargeting,
	InstantConfigService,
	targetingService,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { createSelectedStrategy } from './targeting-strategies/factories/create-selected-strategy';
import { createFandomContext } from './targeting-strategies/factories/create-fandom-context';
import { TargetingTags } from './targeting-strategies/interfaces/taxonomy-tags';

const SKIN = Symbol('targeting skin');

@Injectable()
export class UcpTargetingSetup implements DiProcess {
	static skin(skin: string): Binder {
		return {
			bind: SKIN,
			value: skin,
		};
	}

	constructor(@Inject(SKIN) private skin: string, protected instantConfig: InstantConfigService) {}

	execute(): void {
		targetingService.extend({
			...targetingService.getAll(),
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
			context.set('custom.dbNameForAdUnit', targetingService.getAll<GlobalTargeting>().s1);
		}

		targetingService.set(
			'bundles',
			utils.targeting.getTargetingBundles(this.instantConfig.get('icTargetingBundles')),
		);
	}

	private getPageLevelTargeting(): TargetingTags {
		const selectedStrategy: string = this.instantConfig.get('icTargetingStrategy');

		utils.logger('Targeting', `Selected targeting priority strategy: ${selectedStrategy}`);

		return createSelectedStrategy(selectedStrategy, createFandomContext(), this.skin).get();
	}
}
