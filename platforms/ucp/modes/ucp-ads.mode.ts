import { AdsMode, startAdEngine, wadRunner } from '@platforms/shared';
import { bidders, context, permutive } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpAdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.requestBids());
		inhibitors.push(wadRunner.call());

		permutive.call();

		return inhibitors;
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
