import { AdsMode, startAdEngine, wadRunner } from '@platforms/shared';
import { context, nielsen } from '@wikia/ad-engine';

export class F2AdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(wadRunner.call());

		nielsen.call({
			type: 'static',
			assetid: `fandom.com/news_and_stories/${targeting.s1}/${targeting.post_id}`,
			section: `FANDOM NEWS AND STORIES NETWORK`,
		});

		return inhibitors;
	}
}
