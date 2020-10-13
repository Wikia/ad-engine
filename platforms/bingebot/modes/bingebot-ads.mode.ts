import { startAdEngine } from '@platforms/shared';
import { DiProcess, permutive } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		startAdEngine(inhibitors);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		permutive.call();

		return inhibitors;
	}
}
