import { LazyQueue, logger, makeLazyQueue } from './utils';
import { FloatingAd } from './templates';
import { GptProvider, PrebidiumProvider } from './providers';
import { scrollListener } from './listeners';
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
import { AdSlot } from './models';

const logGroup = 'ad-engine';

export class AdEngine {
	constructor(config = null) {
		context.extend(config);
		this.started = false;

		window.ads = window.ads || {};
		window.ads.runtime = window.ads.runtime || {};

		templateService.register(FloatingAd);

		eventService.on(events.PAGE_CHANGE_EVENT, () => {
			this.started = false;
			this.setupAdStack();
		});
	}

	init() {
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

	/**
	 * @private
	 */
	setupProviders() {
		const providerName = context.get('state.provider');

		switch (providerName) {
			case 'prebidium':
				this.provider = new PrebidiumProvider();
				break;
			case 'gpt':
			default:
				this.provider = new GptProvider();
		}
	}

	/**
	 * @private
	 */
	setupAdStack() {
		this.adStack = context.get('state.adStack');
		if (!this.adStack.start) {
			makeLazyQueue(this.adStack, (ad) => {
				const adSlot = new AdSlot(ad);

				slotService.add(adSlot);
				this.provider.fillIn(adSlot);
			});
		}
	}

	/**
	 * @private
	 */
	setupPushOnScrollQueue() {
		if (context.get('events.pushOnScroll')) {
			const pushOnScrollIds = context.get('events.pushOnScroll.ids');
			const pushOnScrollQueue = new LazyQueue(...pushOnScrollIds);

			pushOnScrollQueue.onItemFlush((id) => {
				scrollListener.addSlot(this.adStack, id, context.get('events.pushOnScroll.threshold'));
			});
			context.set('events.pushOnScroll.ids', pushOnScrollQueue);
			pushOnScrollQueue.flush();
		}
	}

	async runAdQueue() {
		const delayModulesPromises = this.getDelayModulesPromises();
		const maxTimeout = context.get('options.maxDelayTimeout');
		const timeoutPromise = new Promise((resolve) => setTimeout(resolve, maxTimeout));

		logger(logGroup, `Delay by ${delayModulesPromises.length} modules (${maxTimeout}ms timeout)`);

		await Promise.race([Promise.all(delayModulesPromises), timeoutPromise]);

		logger(logGroup, 'startAdQueue', 'Ready');
		this.startAdStack();
	}

	/**
	 * @private
	 * @returns {*[]}
	 */
	getDelayModulesPromises() {
		const delayModules = context.get('delayModules') || [];

		return delayModules
			.filter((delayModule) => delayModule.isEnabled())
			.map((delayModule) => {
				logger(logGroup, 'Register delay module', delayModule.getName());

				return delayModule.getPromise();
			});
	}

	/**
	 * @private
	 */
	startAdStack() {
		if (!this.started) {
			eventService.emit(events.AD_STACK_START);
			this.started = true;
			this.adStack.start();
		}
	}
}
