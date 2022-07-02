import {
	Binder,
	communicationService,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	Targeting,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { getCrossDomainTargeting } from '../../utils/get-cross-domain-targeting';
import { TargetingStrategyExecutor } from './targeting-strategy-executor';
import {
	DEFAULT_PRIORITY_STRATEGY,
	TargetingStrategyPriorityService,
} from './targeting-strategies/services/targeting-strategy-priority-service';
import { targetingStrategiesBuilder } from './targeting-strategies/builders/targeting-strategies-builder';
import { targetingStrategyPrioritiesBuilder } from './targeting-strategies/builders/targeting-strategy-priorities-builder';

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
		// TODO TB remove after dev
		console.log(context.get('targeting'));

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
		const selectedStrategy: string = this.instantConfig.get(
			'icTargetingStrategy',
			DEFAULT_PRIORITY_STRATEGY,
		);

		const priorityService = new TargetingStrategyPriorityService(
			targetingStrategyPrioritiesBuilder(),
			selectedStrategy,
			utils.logger,
		);

		return new TargetingStrategyExecutor(
			targetingStrategiesBuilder(this.skin),
			priorityService,
		).execute();
	}
}
