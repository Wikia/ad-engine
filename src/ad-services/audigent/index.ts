import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

/* tslint:disable */
const logGroup = 'audigent';
const scriptUrl = 'https://seg.ad.gt/api/v1/segments.js';
const audigentLoadedEvent = globalAction('[AdEngine] Audigent loaded', props<{}>());

class Audigent {
	private isLoaded = false;

	private isEnabled(): boolean {
		return (
			context.get('services.audigent.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			this.configureAudienceTag();
			utils.scriptLoader.loadScript(scriptUrl, 'text/javascript', true, 'first').then(() => {
				this.setup();
				communicationService.dispatch(audigentLoadedEvent({}));
			});
			this.isLoaded = true;
		}
	}

	configureAudienceTag(): void {
		// @ts-ignore
		(function(w,d,t,u){var a=d.createElement(t);a.async=1;a.src=u+'?url='+encodeURIComponent(w.location.href)+'&ref='+encodeURIComponent(d.referrer);var s=d.getElementsByTagName(t)[0];s.parentNode.insertBefore(a,s);})(window,document,'script','https://a.ad.gt/api/v1/u/matches/158');
	}

	setup(): void {
		// @ts-ignore
		if (typeof au_seg !== 'undefined') {
			// @ts-ignore
			const au_segments = au_seg.segments || [];

			window.googletag.cmd = window.googletag.cmd || [];
			window.googletag.cmd.push(() => {
				const segments = au_segments.length ? au_segments : 'no_segments';

				googletag.pubads().setTargeting('AU_SEG', segments);
				context.set('targeting.AU_SEG', segments);
			});
		}
	}
}

export const audigent = new Audigent();
