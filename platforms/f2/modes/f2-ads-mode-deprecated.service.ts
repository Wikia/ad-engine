import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	context,
	DiProcess,
	iasPublisherOptimization,
	jwPlayerInhibitor,
	JWPlayerManager,
	nielsen,
	Runner,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2LegacyAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer();

		const jwpInhibitor = [jwPlayerInhibitor.get()];
		const jwpMaxTimeout = context.get('options.jwpMaxDelayTimeout');
		new Runner(jwpInhibitor, jwpMaxTimeout, 'jwplayer-inhibitor').waitForInhibitors().then(() => {
			startAdEngine(inhibitors);
		});
	}

	private async setupJWPlayer(): Promise<any> {
		new JWPlayerManager().manage();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(wadRunner.call());

		audigent.call();
		iasPublisherOptimization.call();
		nielsen.call();

		return inhibitors;
	}
}
