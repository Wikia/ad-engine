import { context, utils } from '@ad-engine/core';

type DeviceType = 'mo' | 'de' | 'tb';

const logGroup = 'Optimera';
const CLIENT_ID = '82';

const oDevice: DeviceType = context.get('state.isMobile') ? 'mo' : 'de';
const oDv = [CLIENT_ID, 'top_leaderboard', 'top_boxad', 'bottom_leaderboard'];
const oVa = {
	top_leaderboard: ['NULL'],
	top_boxad: ['NULL'],
	bottom_leaderboard: ['NULL'],
};

class Optimera {
	isEnabled(): boolean {
		return context.get('services.optimera.enabled');
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.reject('Optimera disabled');
		}

		this.loadScript()
			.then(() => {
				utils.logger(logGroup, 'loaded');
				this.setTargeting();
				return Promise.resolve('Optimera loaded with success');
			})
			.catch(() => {
				utils.logger(logGroup, 'loading failed.');
				return Promise.reject('Optimera loading failed');
			});
	}

	getHardcodedScript(): HTMLScriptElement {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = `
			var oDv = ${JSON.stringify(oDv)};
			var oVa = ${JSON.stringify(oVa)};
			var oDevice = ${JSON.stringify(oDevice)};
			
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
		context.set('targeting.optimera', oVa['top_leaderboard']);
		context.set('targeting.optimera', oVa['top_boxad']);
		context.set('targeting.optimera', oVa['bottom_leaderboard']);
	}
}

export const optimera = new Optimera();
