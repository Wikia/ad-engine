import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	context,
	externalLogger,
	targetingService,
	UniversalStorage,
	Usp,
	usp,
	utils,
} from '@ad-engine/core';
import { A9Bid, A9BidConfig, A9CCPA, ApstagConfig } from '../a9/types';

const logGroup = 'a9-apstag';

export class Apstag {
	private static instance: Apstag;

	static make(): Apstag {
		if (!Apstag.instance) {
			Apstag.reset();
		}

		return Apstag.instance;
	}

	/**
	 * @deprecated
	 * Used in unit tests.
	 */
	static reset(): Apstag {
		Apstag.instance = new Apstag();

		return Apstag.instance;
	}

	private script: Promise<Event>;
	private renderImpEndCallbacks = [];
	storage: UniversalStorage;
	utils = utils;
	usp: Usp = usp;

	private constructor() {
		this.storage = new UniversalStorage();
		this.insertScript();
		this.configure();
		this.addRenderImpHook();
	}

	private insertScript(): void {
		this.script = this.utils.scriptLoader.loadScript(
			'//c.amazon-adsystem.com/aax2/apstag.js',
			true,
			'first',
		);
	}

	public sendMediaWikiHEM(): void {
		const userEmailHashes: [string, string, string] = context.get('wiki.opts.userEmailHashes');
		if (!Array.isArray(userEmailHashes) || userEmailHashes?.length !== 3) {
			return;
		}
		const record = userEmailHashes[2];
		this.sendHEM(record);
	}

	public async sendHEM(record: string): Promise<void> {
		if (this.storage.getItem('apstagHEMsent') === '1' || !context.get('bidders.a9.rpa')) {
			return;
		}

		const tokenConfig = { hashedRecords: [{ type: 'email', record }] };
		try {
			await this.script;
			utils.logger(logGroup, 'Sending HEM to apstag', tokenConfig);
			window.apstag.rpa(tokenConfig);
			this.storage.setItem('apstagHEMsent', '1');
			communicationService.emit(eventsRepository.A9_APSTAG_HEM_SENT);
		} catch (e) {
			utils.logger(logGroup, 'Error sending HEM to apstag', e);
		}
	}

	private configure(): void {
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

	private async addRenderImpHook(): Promise<void> {
		await this.script;

		const original = window.apstag.renderImp;

		window.apstag.renderImp = (...options) => {
			original(...options);
			const [doc, impId] = options;
			this.renderImpEndCallbacks.forEach((cb) => cb(doc, impId));
		};
	}

	private configureCommand(command, args): void {
		window.apstag._Q.push([command, args]);
	}

	async init(): Promise<void> {
		let signalData = null;

		if (this.usp.exists) {
			signalData = await this.usp.getSignalData();
		}

		const apsConfig = this.getApstagConfig(signalData);
		await this.script;
		window.apstag.init(apsConfig);
		this.sendMediaWikiHEM();
	}

	async fetchBids(bidsConfig: A9BidConfig): Promise<A9Bid[]> {
		await this.script;

		return new Promise((resolve) => {
			window.apstag.fetchBids(bidsConfig, (currentBids) => resolve(currentBids));
		});
	}

	async targetingKeys(): Promise<string[]> {
		await this.script;

		return window.apstag.targetingKeys();
	}

	async enableDebug(): Promise<void> {
		await this.script;
		window.apstag.debug('enable');
	}

	async disableDebug(): Promise<void> {
		await this.script;
		window.apstag.debug('disable');
	}

	/**
	 * Executes callback each time after apstag.renderImp is called
	 */
	async onRenderImpEnd(callback: (doc: HTMLDocument, impId: string) => void): Promise<void> {
		if (typeof callback !== 'function') {
			throw new Error('onRenderImpEnd used with callback not being a function');
		}
		this.renderImpEndCallbacks.push(callback);
	}

	private getApstagConfig(signalData: SignalData): ApstagConfig {
		const amazonId = context.get('bidders.a9.amazonId');
		const ortb2 = targetingService.get('openrtb2', 'openrtb2');
		externalLogger.log('openrtb2 signals', { signals: JSON.stringify(ortb2) });

		return {
			pubID: amazonId,
			videoAdServer: 'DFP',
			deals: true,
			...Apstag.getCcpaIfApplicable(signalData),
			signals: { ortb2 },
		};
	}

	private static getCcpaIfApplicable(signalData: SignalData): Partial<A9CCPA> {
		if (signalData && signalData.uspString) {
			return {
				params: {
					us_privacy: signalData.uspString,
				},
			};
		}

		return {};
	}
}
