import { utils } from '@ad-engine/core';
import { A9Bid, A9BidConfig } from '../a9/types';

export class Apstag {
	private static instance: Apstag;

	static make(): Apstag {
		if (!Apstag.instance) {
			Apstag.instance = new Apstag();
		}

		return Apstag.instance;
	}

	private script: Promise<Event>;
	private renderImpEndCallbacks = [];
	utils = utils;

	private constructor() {
		this.insertScript();
		this.configure();
		this.addRenderImpHook();
	}

	private insertScript(): void {
		this.script = this.utils.scriptLoader.loadScript(
			'//c.amazon-adsystem.com/aax2/apstag.js',
			'text/javascript',
			true,
			'first',
		);
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

	async init(apsConfig): Promise<void> {
		await this.script;
		window.apstag.init(apsConfig);
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
}
