import { context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'optimera';
const CLIENT_ID = '82';

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
			await this.loadScoreFileScript();
			await this.updateOvaVariable();
			this.sendTrackingEvent();
			await this.loadOpsScript();
			this.setTargeting();
		} catch (e) {
			utils.logger(logGroup, 'loading failed.', e.message);
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
		const url = `https://dyv1bugovvq1g.cloudfront.net/${CLIENT_ID}/${
			optimeraHost + optimeraPathName
		}.js`;

		await utils.scriptLoader.loadScript(url);
		utils.logger(logGroup, 'score file loaded');
	}

	sendTrackingEvent(): void {
		communicationService.emit(eventsRepository.OPTIMERA_FINISHED);
	}

	// Variable 'oVa' needs to be updated as it gets overwritten after loading score file
	async updateOvaVariable(): Promise<void> {
		const conditionMet = await new utils.WaitFor(this.isConfigUpdated, 3, 100).until();
		if (!conditionMet) {
			return Promise.reject(new Error('oVa variable not updated'));
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
		return Promise.resolve();
	}

	async loadOpsScript(): Promise<void> {
		const url = `https://d15kdpgjg3unno.cloudfront.net/oPS.js?cid=${CLIENT_ID}`;

		await utils.scriptLoader.loadScript(url);
		utils.logger(logGroup, 'ops script loaded');
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

	isConfigUpdated(): boolean {
		if (!window.oVa || !window.oDv) {
			return false;
		}

		for (let i = 1; i < window.oDv.length; i++) {
			if (window.oVa[window.oDv[i]] !== ['NULL']) {
				return true;
			}
		}

		return false;
	}
}

export const optimera = new Optimera();
