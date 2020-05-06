import { AdsMode, startAdEngine, wadRunner } from '@platforms/shared';

export class F2AdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(wadRunner.call());

		return inhibitors;
	}
}
