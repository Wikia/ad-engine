import { LazyQueue, logger } from './utils';
import { FloatingAd } from './templates';
import { GptProvider, PrebidiumProvider } from './providers';
import { scrollListener } from './listeners';
import {
	btfBlockerService,
	context,
	events,
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

		events.on(events.PAGE_CHANGE_EVENT, () => {
			this.started = false;
			this.setupAdStackQueue();
		});
	}

	init() {
		this.setupProviders();
		this.setupAdStackQueue();
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
	setupAdStackQueue() {
		const adStack = context.get('state.adStack');

		if (adStack instanceof LazyQueue) {
			return;
		}

		this.adStackQueue = new LazyQueue(...adStack);
		this.adStackQueue.onItemFlush((ad) => {
			const adSlot = new AdSlot(ad);

			slotService.add(adSlot);
			this.provider.fillIn(adSlot);
		});
		context.set('state.adStack', this.adStackQueue);
	}

	/**
	 * @private
	 */
	setupPushOnScrollQueue() {
		if (context.get('events.pushOnScroll')) {
			const pushOnScrollIds = context.get('events.pushOnScroll.ids');
			const pushOnScrollQueue = new LazyQueue(...pushOnScrollIds);

			pushOnScrollQueue.onItemFlush((id) => {
				scrollListener.addSlot(this.adStackQueue, id, context.get('events.pushOnScroll.threshold'));
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
		this.flushAdStackQueue();
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
	flushAdStackQueue() {
		if (!this.started) {
			events.emit(events.AD_STACK_START);
			this.started = true;
			this.adStackQueue.flush();
		}
	}
}
