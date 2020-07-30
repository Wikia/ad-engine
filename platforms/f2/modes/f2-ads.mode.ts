import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	context,
	iasPublisherOptimization,
	JWPlayerManager,
	nielsen,
	permutive,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2AdsMode implements AdsMode {
	constructor(private pageTracker: PageTracker) {}

	execute(): void {
		const inhibitors = this.callExternals();

		this.setupJWPlayer();
		startAdEngine(inhibitors);

		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private async setupJWPlayer(): Promise<any> {
		new JWPlayerManager().manage();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(wadRunner.call());

		permutive.call();
		audigent.call();
		iasPublisherOptimization.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/news_and_stories/${targeting.s1}/${targeting.post_id}`,
			section: `FANDOM NEWS AND STORIES NETWORK`,
		});

		return inhibitors;
	}
}
