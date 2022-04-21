import { communicationService, eventsRepository } from '@ad-engine/communication';
import { scrollListener } from './listeners';
import { AdSlot } from './models';
import { GptProvider, Nativo, NativoProvider, PrebidiumProvider, Provider } from './providers';
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
import { LazyQueue, makeLazyQueue, OldLazyQueue, logger } from './utils';
import { slotReloader } from "./services/slot-reloader";

const logGroup = 'ad-engine';

export interface AdStackPayload {
	id: string;
}

export function getAdStack(): OldLazyQueue<AdStackPayload> {
	const adStack = context.get('state.adStack');

	logger(logGroup, 'getting adStack: ', ...adStack);

	return adStack;
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

	async init(inhibitors: Promise<any>[] = []): Promise<void> {
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
		slotReloader.init();
		this.setupPushOnScrollQueue();
	}

	private setupProviders(): void {
		const providerName: string = context.get('state.provider');
		this.defaultProvider = this.createProvider(providerName);

		const nativo = new Nativo(context);
		if (nativo.isEnabled()) {
			nativo.load();
		} else {
			nativo.replaceWithAffiliateUnit();
		}
	}

	private setupAdStack(): void {
		this.adStack = getAdStack();
		if (!this.adStack.start) {
			makeLazyQueue<AdStackPayload>(this.adStack as any, (ad: AdStackPayload) => {
				const adSlot = new AdSlot(ad);

				if (
					adSlot.isFirstCall() ||
					adSlot.isInitStage() ||
					!context.get('bidders.prebid.multiAuction')
				) {
					this.pushSlot(adSlot);
				} else {
					communicationService.on(eventsRepository.BIDDERS_MAIN_STAGE_DONE, () => {
						this.pushSlot(adSlot);
					});
				}
			});
		}
	}

	private pushSlot(adSlot: AdSlot): void {
		const providersChain = context.get(`slots.${adSlot.getSlotName()}.providers`) || [];
		slotService.add(adSlot);

		if (providersChain.length > 0) {
			// TODO: this is PoC and most likely we'll extend it and move to the AdLayoutBuilder (ADEN-11388)
			const providerName = providersChain.shift();
			const provider = this.createProvider(providerName);
			provider.fillIn(adSlot);
		} else {
			this.defaultProvider.fillIn(adSlot);
		}
	}

	private createProvider(providerName: string) {
		switch (providerName) {
			case 'prebidium':
				return new PrebidiumProvider();
			case 'nativo':
				return new NativoProvider(window.ntv);
			default:
				return new GptProvider();
		}
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
