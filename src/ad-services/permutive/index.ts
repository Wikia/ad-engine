import { context, utils } from '@ad-engine/core';

/* tslint:disable */
const PROJECT_ID = '88ca3150-0f6f-482a-bbc1-2aa3276b3cab';
const PUBLIC_API_KEY = '0006e595-b3f2-4dfc-b3a4-657eb42a74cf';
// @ts-ignore
const NAMESPACE = 'fandom';
const logGroup = 'permutive';

class Permutive {
	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'loading');
		this.configure();
		this.loadScript();
		this.setTargeting();
		this.setAddon('web', {});
	}

	isEnabled(): boolean {
		return (
			context.get('services.permutive.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale')
		)
	}

	configure(): void {
		// @ts-ignore
		!function(n,e,o,r,i){if(!e){e=e||{},window.permutive=e,e.q=[],e.config=i||{},e.config.projectId=o,e.config.apiKey=r,e.config.environment=e.config.environment||"production";for(var t=["addon","identify","track","trigger","query","segment","segments","ready","on","once","user","consent"],c=0;c<t.length;c++){var f=t[c];e[f]=function(n){return function(){var o=Array.prototype.slice.call(arguments,0);e.q.push({functionName:n,arguments:o})}}(f)}}}(document,window.permutive,PROJECT_ID,PUBLIC_API_KEY,{});
	}

	setTargeting(): void {
		const segments = window.localStorage.getItem('_pdfps');
		let permutiveTargeting = segments ? JSON.parse(segments) : [];

		permutiveTargeting.push('_test');
		context.set('targeting.permutive', permutiveTargeting);
	}

	loadScript(): Promise<Event> {
		return utils.scriptLoader.loadScript(
			`https://cdn.permutive.com/${PROJECT_ID}-web.js`,
			'text/javascript',
			true,
			'first',
			{ id: 'permutive'},
		);
	}

	setAddon(key: string, val: object): void {
		if (window.permutive) {
			window.permutive.addon(key, val);
		}
	}
}

export const permutive = new Permutive();
