import { AdsMode, startAdEngine } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotAdsMode implements AdsMode {
	execute(): void {
		startAdEngine();
	}
}
