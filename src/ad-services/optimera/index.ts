import { context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'optimera';
const CLIENT_ID = '82';
const SCRIPT_URL_BASE = 'https://dyv1bugovvq1g.cloudfront.net';

class Optimera {
	private oDevice = context.get('state.isMobile') ? 'mo' : 'de';
	private oDv = [CLIENT_ID, 'top_leaderboard', 'top_boxad', 'bottom_leaderboard'];
	private oVa: any = {
		top_leaderboard: ['NULL'],
		top_boxad: ['NULL'],
		bottom_leaderboard: ['NULL'],
	};

	isEnabled(): boolean {
		return context.get('services.optimera.enabled');
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		try {
			this.loadGlobalVariablesScript();
			await Promise.all([this.loadScoreFileScript(), this.loadOpsScript()]);

			const configUpdated = await this.checkOptimeraConfig();
			if (!configUpdated) {
				utils.logger(logGroup, 'config update failed');
				return;
			}

			this.setTargeting();
			this.sendTrackingEvent();
		} catch (e) {
			utils.logger(logGroup, 'loading failed', e.message);
		}
	}

	loadGlobalVariablesScript(): void {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = `
			var oDv = ${JSON.stringify(this.oDv)};
			var oVa = ${JSON.stringify(this.oVa)};
			var oDevice = ${JSON.stringify(this.oDevice)};
		`;

		document.head.prepend(script);
		utils.logger(logGroup, 'global variables loaded');
	}

	async loadScoreFileScript(): Promise<void> {
		const optimeraHost = window.location.host;
		const optimeraPathName = window.location.pathname;
		const url = `${SCRIPT_URL_BASE}/${CLIENT_ID}/${optimeraHost + optimeraPathName}.js`;

		try {
			await utils.scriptLoader.loadScript(url);
			utils.logger(logGroup, 'score file loaded');
		} catch (e) {
			utils.logger(logGroup, 'loading score file failed');
		}
	}

	async loadOpsScript(): Promise<void> {
		const url = `https://d15kdpgjg3unno.cloudfront.net/oPS.js?cid=${CLIENT_ID}`;

		try {
			await utils.scriptLoader.loadScript(url);
			utils.logger(logGroup, 'ops measurement file loaded');
		} catch (e) {
			utils.logger(logGroup, 'loading ops measurement file failed');
		}
	}

	// Variable 'oVa' needs to be updated as it gets overwritten after loading score file
	async checkOptimeraConfig(): Promise<boolean> {
		const conditionMet = await new utils.WaitFor(this.isConfigUpdated, 3, 100).until();
		if (!conditionMet) {
			return Promise.resolve(false);
		}

		if (
			this.oDevice &&
			typeof window.oVa.device === 'object' &&
			typeof window.oVa.device[this.oDevice] === 'object'
		) {
			this.oVa = window.oVa.device[this.oDevice];
		} else {
			this.oVa = window.oVa;
		}

		utils.logger(logGroup, 'oVa variable updated');
		return Promise.resolve(conditionMet);
	}

	isConfigUpdated(): boolean {
		if (!window.oVa || !window.oDv) {
			return false;
		}

		for (let i = 1; i < window.oDv.length; i++) {
			if (!window.oVa[window.oDv[i]].includes('NULL')) {
				return true;
			}
		}

		return false;
	}

	sendTrackingEvent(): void {
		communicationService.emit(eventsRepository.OPTIMERA_FINISHED);
		utils.logger(logGroup, 'tracking event sent');
	}

	setTargeting(): void {
		for (let i = 1; i < this.oDv.length; i++) {
			this.setSlotTargeting(this.oDv[i], this.oVa[this.oDv[i]]);
		}
		utils.logger(logGroup, 'slot targeting set');
	}

	setSlotTargeting(slotName: string, value: string): void {
		context.set(`slots.${slotName}.targeting.optimera`, value);
	}
}

export const optimera = new Optimera();
