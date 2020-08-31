import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UcpMercuryAdsMode implements AdsMode {
	constructor(private pageTracker: PageTracker) {}

	execute(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.trackAdEngineStatus();
		this.trackTabId();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private trackTabId(): void {
		if (!context.get('options.tracking.tabId')) {
			return;
		}

		window.tabId = sessionStorage.tab_id ? sessionStorage.tab_id : (sessionStorage.tab_id = uuid());

		this.pageTracker.trackProp('tab_id', window.tabId);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(wadRunner.call());

		return inhibitors;
	}
}
