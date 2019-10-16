import { bidders, context, durationMedia } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { biddersDelay } from '../../bidders/bidders-delay';
import { startAdEngine } from '../start-ad-engine';
import { AdsMode } from './_ads.mode';

@Injectable()
export class SportsAdsMode implements AdsMode {
	handleAds(): void {
		this.callExternals();
		startAdEngine();
		this.setAdStack();
	}

	private callExternals(): void {
		bidders.requestBids({
			responseListener: biddersDelay.markAsReady,
		});

		durationMedia.call();
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'cdm-zone-01' });
		context.push('state.adStack', { id: 'cdm-zone-02' });
		context.push('state.adStack', { id: 'cdm-zone-03' });
		context.push('state.adStack', { id: 'cdm-zone-06' });
		context.push('events.pushOnScroll.ids', 'cdm-zone-04');
	}
}
