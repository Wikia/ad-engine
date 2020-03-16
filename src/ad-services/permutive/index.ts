import { context, utils } from '@ad-engine/core';

/* tslint:disable */
const PROJECT_ID = '88ca3150-0f6f-482a-bbc1-2aa3276b3cab';
const PUBLIC_API_KEY = '0006e595-b3f2-4dfc-b3a4-657eb42a74cf';
// @ts-ignore
const NAMESPACE = 'fandom';
const logGroup = 'permutive';

class Permutive {
	isSetUp: boolean = false;

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		this.setup();
		this.setAddon();
	}

	private setup(): void {
		if (!this.isSetUp) {
			utils.logger(logGroup, 'loading');
			this.configure();
			this.loadScript();
			this.setTargeting();
			this.isSetUp = true;
		}
	}

	private isEnabled(): boolean {
		return (
			context.get('services.permutive.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale')
		)
	}

	private configure(): void {
		// @ts-ignore
		!function(n,e,o,r,i){if(!e){e=e||{},window.permutive=e,e.q=[],e.config=i||{},e.config.projectId=o,e.config.apiKey=r,e.config.environment=e.config.environment||"production";for(var t=["addon","identify","track","trigger","query","segment","segments","ready","on","once","user","consent"],c=0;c<t.length;c++){var f=t[c];e[f]=function(n){return function(){var o=Array.prototype.slice.call(arguments,0);e.q.push({functionName:n,arguments:o})}}(f)}}}(document,window.permutive,PROJECT_ID,PUBLIC_API_KEY,{});
	}

	private getTargeting(): Array<string> {
		if (window.googletag.pubads) {
			const permutiveGptTargeting = window.googletag.pubads().getTargeting('permutive');

			if (permutiveGptTargeting.length) {
				return permutiveGptTargeting;
			}
		}

		const segments = window.localStorage.getItem('_pdfps');
		let permutiveTargeting = segments ? JSON.parse(segments) : [];
		permutiveTargeting.push('_test');

		return permutiveTargeting;
	}

	private setTargeting(): void {
		context.set('targeting.permutive', () => this.getTargeting());
	}

	private loadScript(): Promise<Event> {
		return utils.scriptLoader.loadScript(
			`https://cdn.permutive.com/${PROJECT_ID}-web.js`,
			'text/javascript',
			true,
			'first',
			{ id: 'permutive'},
		);
	}

	private getPageViewEventSchema(): object {
		return {
			'page': {
				'page_info': {
					's0': context.get('targeting.s0'),
					's1': context.get('targeting.s1'),
					'skin': context.get('targeting.skin'),
					'lang': context.get('targeting.lang'),
					'esrb': context.get('targeting.esrb'),
					'age': context.get('targeting.age'),
					'sex': context.get('targeting.sex'),
					'gnre': context.get('targeting.gnre'),
					'media': context.get('targeting.media'),
					'pform': context.get('targeting.pform'),
					'pub': context.get('targeting.pub'),
					'theme': context.get('targeting.theme'),
					'tv': context.get('targeting.tv'),
					'src': context.get('src'),
					'geo': utils.geoService.getCountryCode(),
				},
			}
		}
	}

	private setAddon(): void {
		if (window.permutive) {
			window.permutive.addon(
				'web',
				this.getPageViewEventSchema(),
			);
		}
	}
}

export const permutive = new Permutive();
