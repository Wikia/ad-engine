import { scrollListener } from './listeners';
import { AdSlot, DelayModule } from './models';
import { GptProvider, PrebidiumProvider, Provider } from './providers';
import {
	btfBlockerService,
	context,
	events,
	eventService,
	messageBus,
	registerCustomAdLoader,
	slotRepeater,
	slotService,
	slotTweaker,
	templateService,
} from './services';
import { FloatingAd } from './templates';
import { LazyQueue, logger, makeLazyQueue, OldLazyQueue } from './utils';

export interface AdStackPayload {
	id: string;
}

const logGroup = 'ad-engine';

export const DEFAULT_MAX_DELAY = 2000;

export class AdEngine {
	started = false;
	provider: Provider;
	adStack: OldLazyQueue<AdStackPayload>;

	constructor(config = null) {
		context.extend(config);

		window.ads = window.ads || ({} as Ads);
		window.ads.runtime = window.ads.runtime || ({} as Runtime);

		templateService.register(FloatingAd);

		eventService.on(events.PAGE_CHANGE_EVENT, () => {
			this.started = false;
			this.setupAdStack();
		});
	}

	init(): void {
		this.setupProviders();
		this.setupAdStack();
		btfBlockerService.init();

		registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
		messageBus.init();
		slotTweaker.registerMessageListener();
		this.runAdQueue();

		scrollListener.init();
		slotRepeater.init();
		this.setupPushOnScrollQueue();
	}

	private setupProviders(): void {
		const providerName: string = context.get('state.provider');

		switch (providerName) {
			case 'prebidium':
				this.provider = new PrebidiumProvider();
				break;
			case 'gpt':
			default:
				this.provider = new GptProvider();
		}
	}

	private setupAdStack(): void {
		this.adStack = context.get('state.adStack');
		if (!this.adStack.start) {
			makeLazyQueue<AdStackPayload>(this.adStack as any, (ad: AdStackPayload) => {
				const adSlot = new AdSlot(ad);

				slotService.add(adSlot);
				this.provider.fillIn(adSlot);
			});
		}
	}

	private setupPushOnScrollQueue(): void {
		if (context.get('events.pushOnScroll')) {
			const pushOnScrollIds: string[] = context.get('events.pushOnScroll.ids') || [];
			const pushOnScrollQueue = new LazyQueue<string>(...pushOnScrollIds);

			pushOnScrollQueue.onItemFlush((id: string) => {
				scrollListener.addSlot(this.adStack, id, {
					threshold: context.get('events.pushOnScroll.threshold') || 0,
				});
			});
			context.set('events.pushOnScroll.ids', pushOnScrollQueue);
			pushOnScrollQueue.flush();
		}
	}

	async runAdQueue(): Promise<void> {
		const delayModulesPromises: Promise<void>[] = this.getDelayModulesPromises();
		const maxTimeout: number = context.get('options.maxDelayTimeout');
		const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, maxTimeout));

		logger(logGroup, `Delay by ${delayModulesPromises.length} modules (${maxTimeout}ms timeout)`);

		await Promise.race([Promise.all(delayModulesPromises), timeoutPromise]);

		logger(logGroup, 'startAdQueue', 'Ready');
		this.startAdStack();
	}

	private getDelayModulesPromises(): Promise<void>[] {
		const delayModules: DelayModule[] = context.get('delayModules') || [];

		return delayModules
			.filter((delayModule: DelayModule) => delayModule.isEnabled())
			.map((delayModule: DelayModule) => {
				logger(logGroup, 'Register delay module', delayModule.getName());

				return delayModule.getPromise();
			});
	}

	private startAdStack(): void {
		if (!this.started) {
			eventService.emit(events.AD_STACK_START);
			this.started = true;
			this.adStack.start();
		}
	}
}
