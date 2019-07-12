import { utils } from '@wikia/ad-engine';

export class Apstag {
	/**
	 * @private
	 */
	static instance;

	static make() {
		if (!Apstag.instance) {
			Apstag.instance = new Apstag();
		}

		return Apstag.instance;
	}

	private renderImpEndCallbacks = [];
	private renderImpHookPresent = false;
	utils = utils;

	/**
	 * @private
	 */
	constructor() {
		this.insertScript();
		this.configure();
	}

	/**
	 * @private
	 */
	insertScript() {
		this.utils.scriptLoader.loadScript(
			'//c.amazon-adsystem.com/aax2/apstag.js',
			'text/javascript',
			true,
			'first',
		);
	}

	/**
	 * @private
	 */
	configure() {
		window.apstag = window.apstag || { _Q: [] };

		if (typeof window.apstag.init === 'undefined') {
			window.apstag.init = (...args) => {
				this.configureCommand('i', args);
			};
		}

		if (typeof window.apstag.fetchBids === 'undefined') {
			window.apstag.fetchBids = (...args) => {
				this.configureCommand('f', args);
			};
		}
	}

	/** @private */
	configureCommand(command, args) {
		window.apstag._Q.push([command, args]);
	}

	init(apsConfig) {
		window.apstag.init(apsConfig);
	}

	/**
	 * @param {{slots: A9SlotDefinition[], timeout: number}} bidsConfig configuration of bids
	 * @param {function(object)} cb Callback receiving current bids
	 * @returns {!Promise} If `cb` has been omitted
	 */
	fetchBids(bidsConfig, cb = null) {
		window.apstag.fetchBids(bidsConfig, (currentBids) => cb(currentBids));
	}

	targetingKeys(): string[] {
		return window.apstag.targetingKeys();
	}

	enableDebug() {
		window.apstag.debug('enable');
	}

	disableDebug() {
		window.apstag.debug('disable');
	}

	/**
	 * Executes callback each time after apstag.renderImp is called
	 * @param {function} callback
	 */
	onRenderImpEnd(callback) {
		if (typeof callback !== 'function') {
			throw new Error('onRenderImpEnd used with callback not being a function');
		}
		if (!this.renderImpHookPresent) {
			this.addRenderImpHook();
		}
		this.renderImpEndCallbacks.push(callback);
	}

	/**
	 * @private
	 */
	addRenderImpHook() {
		const original = window.apstag.renderImp;

		window.apstag.renderImp = (...options) => {
			original(...options);
			const [doc, impId] = options;
			this.renderImpEndCallbacks.forEach((cb) => cb(doc, impId));
		};
	}
}
