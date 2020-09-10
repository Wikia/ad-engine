import { startAdEngine } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotAdsMode implements DiProcess {
	execute(): void {
		startAdEngine();
	}
}
