import { AdsMode, startAdEngine, wadRunner } from '@platforms/shared';
import { bidders, context, JWPlayerManager, permutive, Runner } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Communicator } from '@wikia/post-quecast';

@Injectable()
export class UcpAdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		this.setupJWPlayer(inhibitors);
		startAdEngine(inhibitors);

		this.setAdStack();
	}

	private async setupJWPlayer(inhibitors = []): Promise<any> {
		new JWPlayerManager().manage();

		const maxTimeout = context.get('options.maxDelayTimeout');
		const runner = new Runner(inhibitors, maxTimeout, 'jwplayer-runner');

		runner.waitForInhibitors().then(() => {
			this.dispatchJWPlayerSetupAction();
		});
	}

	private dispatchJWPlayerSetupAction(showAds = true): void {
		const communicator = new Communicator();

		communicator.dispatch({
			showAds,
			type: '[Ad Engine] Setup JWPlayer',
			autoplayDisabled: false,
		});
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
	}
}
