import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import { context, JWPlayerManager, jwpSetup, nielsen, permutive, Runner } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class F2AdsMode implements AdsMode {
	constructor(private communicator: Communicator, private pageTracker: PageTracker) {}

	handleAds(): void {
		const inhibitors = this.callExternals();

		this.setupJWPlayer(inhibitors);
		startAdEngine(inhibitors);

		this.setAdStack();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private async setupJWPlayer(inhibitors = []): Promise<any> {
		new JWPlayerManager().manage();

		const maxTimeout = context.get('options.maxDelayTimeout');
		const runner = new Runner(inhibitors, maxTimeout, 'jwplayer-runner');

		runner.waitForInhibitors().then(() => {
			this.dispatchJWPlayerSetupAction();
		});
	}

	private dispatchJWPlayerSetupAction(): void {
		this.communicator.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false })); // TODO support on F2 side
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(wadRunner.call());

		permutive.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/news_and_stories/${targeting.s1}/${targeting.post_id}`,
			section: `FANDOM NEWS AND STORIES NETWORK`,
		});

		return inhibitors;
	}

	private setAdStack(): void {
		// TODO
	}
}
