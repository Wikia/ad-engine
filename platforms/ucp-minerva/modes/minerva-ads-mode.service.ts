import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import { bidders, confiant, context, durationMedia, nielsen, permutive } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaAdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		PageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(bidders.requestBids());
		inhibitors.push(wadRunner.call());

		permutive.call();
		confiant.call();
		durationMedia.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
			section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
		});

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'top_leaderboard' });
		context.push('state.adStack', { id: 'top_boxad' });
		context.push('state.adStack', { id: 'footer' });
	}
}
