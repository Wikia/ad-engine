import { startAdEngine } from '@platforms/shared';
import { DiProcess, permutive } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotAdsMode implements DiProcess {
	execute(): void {
		this.callExternals();
		startAdEngine();
	}

	private callExternals(): void {
		permutive.call();
	}
}
