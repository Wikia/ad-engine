import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	bidders,
	confiant,
	context,
	durationMedia,
	JWPlayerManager,
	nielsen,
	permutive,
	Runner,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class UcpAdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		this.setupJWPlayer(inhibitors);
		startAdEngine(inhibitors);

		this.setAdStack();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		PageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
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
		const communicator = new Communicator();

		communicator.dispatch({
			type: '[Ad Engine] Setup JWPlayer',
			showAds: true,
			autoplayDisabled: false,
		});
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
		context.push('state.adStack', { id: 'hivi_leaderboard' });
		context.push('state.adStack', { id: 'top_leaderboard' });
		context.push('state.adStack', { id: 'top_boxad' });
		context.push('events.pushOnScroll.ids', 'bottom_leaderboard');
		context.push('state.adStack', { id: 'incontent_player' });
		context.push('state.adStack', { id: 'floor_adhesion' });
		context.push('state.adStack', { id: 'invisible_high_impact_2' });
	}
}
