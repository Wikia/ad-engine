import { BaseServiceSetup, context, utils } from '@ad-engine/core';

class LiveRampPixel extends BaseServiceSetup {
	private logGroup = 'LiveRamp';
	private PIXEL_URL = `https://idsync.rlcdn.com/712315.gif?partner_uid=`;

	private isEnabled(): boolean {
		utils.logger(
			this.logGroup,
			'liveRampPixel.enabled',
			context.get('services.liveRampPixel.enabled'),
		);
		utils.logger(
			this.logGroup,
			'directedAtChildren',
			context.get('wiki.targeting.directedAtChildren'),
		);
		return (
			context.get('services.liveRampPixel.enabled') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	private insertLiveRampPixel(): void {
		(function (f, b, e, v, n, t, s) {
			t = b.createElement(e);
			t.async = !0;
			t.src = v;
			s = b.getElementsByTagName(e)[0];
			s.parentNode.insertBefore(t, s);
		})(window, document, 'script', this.PIXEL_URL + context.get('targeting.ppid'));
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'pixel disabled');
			return;
		}
		utils.logger(this.logGroup, 'test');
		this.insertLiveRampPixel();
		return;
	}
}

export const liveRampPixel = new LiveRampPixel();
