import { AdsMode, biddersDelay, startAdEngine } from '@platforms/shared';
import { bidders, context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpAdsMode implements AdsMode {
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
		context.push('state.adStack', { id: 'hivi_leaderboard' });
		context.push('state.adStack', { id: 'top_leaderboard' });
		context.push('state.adStack', { id: 'top_boxad' });
		context.push('events.pushOnScroll.ids', 'bottom_leaderboard');
		context.push('state.adStack', { id: 'incontent_player' });
		context.push('state.adStack', { id: 'floor_adhesion' });
		context.push('state.adStack', { id: 'invisible_high_impact_2' });
		context.push('state.adStack', { id: 'featured' });
	}
}
