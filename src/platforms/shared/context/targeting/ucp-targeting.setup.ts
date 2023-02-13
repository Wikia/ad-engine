import {
	Binder,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';
import { createFandomContext } from './targeting-strategies/factories/create-fandom-context';
import { createSelectedStrategy } from './targeting-strategies/factories/create-selected-strategy';
import { TargetingTags } from './targeting-strategies/interfaces/taxonomy-tags';

const SKIN = Symbol('targeting skin');

@injectable()
export class UcpTargetingSetup implements DiProcess {
	static skin(skin: string): Binder<typeof skin> {
		return [SKIN, { useValue: skin }];
	}

	constructor(@inject(SKIN) private skin: string, protected instantConfig: InstantConfigService) {}

	execute(): void {
		context.set('targeting', {
			...context.get('targeting'),
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
			context.set('custom.dbNameForAdUnit', context.get('targeting.s1'));
		}

		context.set(
			'targeting.bundles',
			utils.targeting.getTargetingBundles(this.instantConfig.get('icTargetingBundles')),
		);
	}

	private getPageLevelTargeting(): TargetingTags {
		const selectedStrategy: string = this.instantConfig.get('icTargetingStrategy');

		utils.logger('Targeting', `Selected targeting priority strategy: ${selectedStrategy}`);

		return createSelectedStrategy(selectedStrategy, createFandomContext(), this.skin).get();
	}
}
