import { context, utils } from '@ad-engine/core';

const logGroup = 'liveramp-pixel';

class LiverampPixel {
	isSetUp = false;
	tagID = '2161';
	pdata = '';

	private isEnabled(): boolean {
		return (
			context.get('services.liverampPixel.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale')
		);
	}

	setup(): void {
		utils.logger(logGroup, 'loading');
		this.insertLiverampPixel();
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		if (!this.isSetUp) {
			this.setup();
			this.isSetUp = true;
		}
	}

	insertLiverampPixel(): void {
		const trackingPixel = document.createElement('img');
		trackingPixel.src = `https://di.rlcdn.com/api/segment?pid=${this.tagID}&pdata=${this.pdata}`;
		trackingPixel.classList.add('tracking-pixel');
	}
}

export const liverampPixel = new LiverampPixel();
