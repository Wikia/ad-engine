import { communicationService, eventsRepository } from '@ad-engine/communication';
import { scrollListener } from './listeners';
import { AdSlot } from './models';
import { GptProvider, PrebidiumProvider, Provider } from './providers';
import { Runner } from './runner';
import {
	btfBlockerService,
	context,
	messageBus,
	registerCustomAdLoader,
	slotRepeater,
	slotService,
	slotTweaker,
	templateService,
} from './services';
import {
	buildTaglessRequestUrl,
	LazyQueue,
	makeLazyQueue,
	OldLazyQueue,
	scriptLoader,
} from './utils';

export interface AdStackPayload {
	id: string;
}

export function getAdStack(): OldLazyQueue<AdStackPayload> {
	return context.get('state.adStack');
}

export const DEFAULT_MAX_DELAY = 2000;

export class AdEngine {
	started = false;
	provider: Provider;
	adStack: OldLazyQueue<AdStackPayload>;

	constructor(config = null) {
		context.extend(config);

		window.ads = window.ads || ({} as MediaWikiAds);
		window.ads.runtime = window.ads.runtime || ({} as Runtime);

		communicationService.on(
			eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE,
			() => {
				slotService.removeAll();
			},
			false,
		);
	}

	async init(inhibitors: Promise<any>[] = []): Promise<void> {
		inhibitors = await this.runInitStack(inhibitors);

		this.setupProviders();
		this.setupAdStack();
		btfBlockerService.init();

		registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
		messageBus.init();
		templateService.subscribeCommunicator();
		slotTweaker.registerMessageListener();

		this.runAdQueue(inhibitors);

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
		this.adStack = getAdStack();
		if (!this.adStack.start) {
			makeLazyQueue<AdStackPayload>(this.adStack as any, (ad: AdStackPayload) => {
				const adSlot = new AdSlot(ad);

				slotService.add(adSlot);
				this.provider.fillIn(adSlot);
			});
		}
	}

	private async runInitStack(inhibitors: Promise<any>[] = []): Promise<Promise<any>[]> {
		if (!context.get('options.initCall')) {
			return inhibitors;
		}

		const slotName = context.get('state.initSlot');
		const adSlot = new AdSlot({ id: slotName });

		slotService.add(adSlot);

		return await scriptLoader.loadAsset(buildTaglessRequestUrl(adSlot), 'text').then((response) => {
			if (!response) {
				return inhibitors;
			}

			try {
				const layoutPayload = JSON.parse(response);

				if (layoutPayload.layout === 'uap') {
					context.set('targeting.uap', layoutPayload.data.lineItemId);
					context.set('targeting.uap_c', layoutPayload.data.creativeId);
				}
			} catch (e) {
				return inhibitors;
			}

			return [];
		});
	}

	private setupPushOnScrollQueue(): void {
		if (context.get('events.pushOnScroll')) {
			const pushOnScrollIds: string[] = context.get('events.pushOnScroll.ids') || [];
			const pushOnScrollQueue = new LazyQueue<string>(...pushOnScrollIds);

			pushOnScrollQueue.onItemFlush((id: string) => {
				scrollListener.addSlot(id, {
					threshold: context.get('events.pushOnScroll.threshold') || 0,
				});
			});
			context.set('events.pushOnScroll.ids', pushOnScrollQueue);
			pushOnScrollQueue.flush();
		}
	}

	runAdQueue(inhibitors: Promise<any>[] = []): void {
		const maxTimeout: number = context.get('options.maxDelayTimeout');

		new Runner(inhibitors, maxTimeout, 'ad-engine-runner').waitForInhibitors().then(() => {
			if (!this.started) {
				communicationService.emit(eventsRepository.AD_ENGINE_STACK_START);

				this.started = true;
				this.adStack.start();
			}
		});
	}
}
