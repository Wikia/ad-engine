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
import { TargetingStrategiesNames, TargetingStrategyExecutor } from './targeting-strategy-executor';
import {
	DEFAULT_PRIORITY_STRATEGY,
	TargetingStrategyPriorityService,
} from './targeting-strategies/services/targeting-strategy-priority-service';
import { targetingStrategyPrioritiesConfigurator } from './targeting-strategies/configurators/targeting-strategy-priorities-configurator';
import { targetingStrategiesConfigurator } from './targeting-strategies/configurators/targeting-strategies-configurator';
import { PageTracker } from '../../tracking/page-tracker';
import { WindowContextDto } from './targeting-strategies/interfaces/window-context-dto';
import { DataWarehouseTracker } from '../../tracking/data-warehouse';

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
		const selectedStrategy: string = this.instantConfig.get(
			'icTargetingStrategy',
			DEFAULT_PRIORITY_STRATEGY,
		);

		const priorityService = new TargetingStrategyPriorityService(
			targetingStrategyPrioritiesConfigurator(),
			selectedStrategy,
			utils.logger,
		);

		return new TargetingStrategyExecutor(
			targetingStrategiesConfigurator(this.skin),
			priorityService,
			this.targetingStrategyListener,
		).execute();
	}

	private targetingStrategyListener(usedStrategy: TargetingStrategiesNames): void {
		if (usedStrategy !== TargetingStrategiesNames.PAGE_CONTEXT) {
			return;
		}

		// @ts-ignore because it does not recognize context correctly
		const windowContext: WindowContextDto = window.context;
		const pageName = windowContext?.page?.pageName;
		const siteName = windowContext?.site?.siteName;

		// TODO this should be injectable, but it ends up undefined when submitted through DI. Fix this.
		const pageTracker = new PageTracker(new DataWarehouseTracker());

		pageTracker.trackProp('PageContextStrategy', `Page name: ${pageName} - Site Name: ${siteName}`);
	}
}
