import { biddersDelay, PlatformAdsMode, startAdEngine } from '@platforms/shared';
import { bidders, context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsMode implements PlatformAdsMode {
	handleAds(): void {
		this.callExternals();
		startAdEngine();
		this.setAdStack();
	}

	private callExternals(): void {
		bidders.requestBids({
			responseListener: biddersDelay.markAsReady,
		});
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'cdm-zone-01' });
		context.push('state.adStack', { id: 'cdm-zone-02' });
		context.push('state.adStack', { id: 'cdm-zone-03' });
		context.push('state.adStack', { id: 'cdm-zone-06' });
		context.push('events.pushOnScroll.ids', 'cdm-zone-04');
	}
}
