import { communicationService, eventsRepository } from '@ad-engine/communication';
import { scrollListener } from './listeners';
import { AdSlot } from './models';
import { GptProvider, NativoProvider, PrebidiumProvider, Provider } from './providers';
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
import { LazyQueue, makeLazyQueue, OldLazyQueue } from './utils';

export interface AdStackPayload {
	id: string;
}

export function getAdStack(): OldLazyQueue<AdStackPayload> {
	return context.get('state.adStack');
}

export const DEFAULT_MAX_DELAY = 2000;

export class AdEngine {
	started = false;
	defaultProvider: Provider;
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

	init(inhibitors: Promise<any>[] = []): void {
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
		this.defaultProvider = this.createProvider(providerName);
	}

	private setupAdStack(): void {
		this.adStack = getAdStack();
		if (!this.adStack.start) {
			makeLazyQueue<AdStackPayload>(this.adStack as any, (ad: AdStackPayload) => {
				const adSlot = new AdSlot(ad);
				slotService.add(adSlot);

				if (context.get(`slots.${ad.id}.providers`)) {
					this.fillWithProvidersChain(adSlot);
				} else {
					this.defaultProvider.fillIn(adSlot);
				}
			});
		}
	}

	private fillWithProvidersChain(adSlot) {
		const providersChain = context.get(`slots.${adSlot.getSlotName()}.providers`);

		while (providersChain.length > 0) {
			const providerName = providersChain.shift();

			const provider = this.createProvider(providerName);

			if (provider.fillIn(adSlot)) {
				break;
			}
		}
	}

	private createProvider(providerName: string) {
		switch (providerName) {
			case 'prebidium':
				return new PrebidiumProvider();
			case 'nativo':
				return new NativoProvider();
			case 'gpt':
			default:
				return new GptProvider();
		}
	}

	private setupPushOnScrollQueue(): void {
		if (context.get('events.pushOnScroll')) {
			const pushOnScrollIds: string[] = context.get('events.pushOnScroll.ids') || [];
			const pushOnScrollQueue = new LazyQueue<string>(...pushOnScrollIds);

			pushOnScrollQueue.onItemFlush((id: string) => {
				const pushOnScrollThresholdKey = this.isNativo(id)
					? 'events.pushOnScroll.nativoThreshold'
					: 'events.pushOnScroll.threshold';
				scrollListener.addSlot(id, {
					threshold: context.get(pushOnScrollThresholdKey) || 0,
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

	private isNativo(id: string): boolean {
		return id == 'ntv_ad';
	}
}
