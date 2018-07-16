import { logger, makeLazyQueue } from './utils';
import { AdSlot } from './models';
import { FloatingAd } from './templates';
import { GptProvider } from './providers';
import { scrollListener } from './listeners';
import {
	btfBlockerService,
	events,
	slotRepeater,
	slotTweaker,
	slotService,
	templateService,
	trackingOptIn,
	registerCustomAdLoader,
	context,
	messageBus
} from './services';

const logGroup = 'ad-engine';

function fillInUsingProvider(ad, provider) {
	const adSlot = new AdSlot(ad);

	slotService.add(adSlot);

	btfBlockerService.push(adSlot, provider.fillIn.bind(provider));
}

function getPromises() {
	return (context.get('delayModules') || [])
		.filter(module => module.isEnabled())
		.map((module) => {
			logger(logGroup, 'Register delay module', module.getName());

			return module.getPromise();
		}) || [];
}

export class AdEngine {
	constructor(config = null) {
		context.extend(config);
		this.providers = new Map();
		this.started = false;

		window.ads = window.ads || {};
		window.ads.runtime = window.ads.runtime || {};

		templateService.register(FloatingAd);

		events.on(events.PAGE_CHANGE_EVENT, () => {
			this.started = false;
			this.setupQueue();
		});
	}

	setupProviders() {
		this.providers.set('gpt', new GptProvider());
	}

	setupQueue() {
		this.adStack = context.get('state.adStack');

		if (!this.adStack.start) {
			makeLazyQueue(this.adStack, (ad) => {
				const gpt = this.providers.get('gpt');

				fillInUsingProvider(ad, gpt);

				if (this.adStack.length === 0) {
					gpt.flush();
				}
			});
		}
	}

	runAdQueue() {
		let timeout = null;

		const promises = getPromises(),
			startAdQueue = () => {
				if (!this.started) {
					events.emit(events.AD_STACK_START);
					this.started = true;
					clearTimeout(timeout);
					this.adStack.start();
				}
			},
			maxTimeout = context.get('options.maxDelayTimeout');

		logger(logGroup, `Delay by ${promises.length} modules (${maxTimeout}ms timeout)`);

		if (promises.length > 0) {
			Promise.all(promises).then(() => {
				logger(logGroup, 'startAdQueue', 'All modules ready');
				startAdQueue();
			});
			timeout = setTimeout(() => {
				logger(logGroup, 'startAdQueue', 'Timeout reached');
				startAdQueue();
			}, maxTimeout);
		} else {
			startAdQueue();
		}
	}

	getProvider(name) {
		return this.providers.get(name);
	}

	init() {
		trackingOptIn.readConsent();
		this.setupProviders();
		this.setupQueue();
		btfBlockerService.init();

		registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
		messageBus.init();
		slotTweaker.registerMessageListener();
		this.runAdQueue();

		scrollListener.init();
		slotRepeater.init();

		if (context.get('events.pushOnScroll')) {
			const pushOnScrollQueue = context.get('events.pushOnScroll.ids');

			makeLazyQueue(pushOnScrollQueue, (id) => {
				scrollListener.addSlot(this.adStack, id, context.get('events.pushOnScroll.threshold'));
			});
			pushOnScrollQueue.start();
		}
	}
}
