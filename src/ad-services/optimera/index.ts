import { context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'optimera';
const CLIENT_ID = '82';

class Optimera {
	isEnabled(): boolean {
		return context.get('services.optimera.enabled');
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		try {
			await this.loadScript();
			utils.logger(logGroup, 'loaded');

			this.setTargeting();
		} catch (e) {
			utils.logger(logGroup, 'loading failed.', e.message);
		}
	}

	getHardcodedScript(): HTMLScriptElement {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = `
			var oDv = ['${CLIENT_ID}', 'top_leaderboard', 'top_boxad', 'bottom_leaderboard'];
			var oVa = {'top_leaderboard':['NULL'],'top_boxad':['NULL'],'bottom_leaderboard':['NULL']};
			var oDevice = ${JSON.stringify(context.get('state.isMobile') ? 'mo' : 'de')};
			
			//Do not edit
			(function() {
			var optimeraHost = window.location.host;
			var optimeraPathName = window.location.pathname;
			var optimeraScript = document.createElement('script');
			optimeraScript.async = true;
			optimeraScript.type = 'text/javascript'; 
			/* IF AVAILABLE: PAGE AD MAP CONFIGURATION */
			optimeraScript.onload = function() {
			  if(typeof oDevice == 'string' && typeof oVa.device == 'object' && typeof oVa.device[oDevice] == 'object') {
			   oVa = oVa.device[oDevice];
			  }
			}
			
			optimeraScript.src="https://dyv1bugovvq1g.cloudfront.net/"+oDv[0]+"/"+optimeraHost+optimeraPathName+".js";
			var node = document.getElementsByTagName('script')[0];
			node.parentNode.insertBefore(optimeraScript, node);
			
			var optimeraOpsScript = document.createElement('script');
			optimeraOpsScript.async = true;
			optimeraOpsScript.type = 'text/javascript';
			optimeraOpsScript.src="https://d15kdpgjg3unno.cloudfront.net/oPS.js?cid="+oDv[0];
			document.head.appendChild(optimeraOpsScript);
			
			/*OPTIONAL TIMEOUT SCRIPT*/
			var s = +new Date;
			while (+new Date < s + 200) {/*Default 200ms Timeout*/};
			})();
		`;
		return script;
	}

	async loadScript(): Promise<void> {
		document.head.prepend(this.getHardcodedScript());
		return Promise.resolve();
	}

	setTargeting(): void {
		communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
			if (!window.oVa) {
				throw new Error(`Optimera 'oVa' variable is not defined`);
			} else if (!window.oDv) {
				throw new Error(`Optimera 'oDv' variable is not defined`);
			}

			const oVa = window.oVa;
			const oDv = window.oDv;

			for (let i = 1; i < oDv.length; i++) {
				this.setSlotTargeting(oDv[i], oVa[oDv[i]]);
			}
		});
	}

	setSlotTargeting(slotName: string, value: string): void {
		context.set(`slots.${slotName}.targeting.optimera`, value);
	}
}

export const optimera = new Optimera();
