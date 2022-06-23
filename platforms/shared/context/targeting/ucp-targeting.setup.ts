import {
	Binder,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	Targeting,
	UapLoadStatus,
	CookieStorageAdapter,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { getCrossDomainTargeting } from '../../utils/get-cross-domain-targeting';
import { TargetingStrategyExecutor } from './targeting-strategy-executor';
import { LegacyStrategyBuilder } from './targeting-strategies/builders/legacy-strategy-builder';
import { PageContextStrategyBuilder } from './targeting-strategies/builders/page-context-strategy-builder';

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
		context.set('targeting', {
			...context.get('targeting'),
			...this.getPageLevelTargeting(),
			...getCrossDomainTargeting(new CookieStorageAdapter()),
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

	private getPageLevelTargeting(): Partial<Targeting> {
		const targetingStrategy = this.instantConfig.get('icTargetingStrategy', 'default');

		const strategies = {
			default: new LegacyStrategyBuilder().build(this.skin),
			pageContext: new PageContextStrategyBuilder().build(this.skin),
		};

		return new TargetingStrategyExecutor(strategies).execute(targetingStrategy);
	}
}
