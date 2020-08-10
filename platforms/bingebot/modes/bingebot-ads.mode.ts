import { AdsMode, startAdEngine } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotAdsMode implements AdsMode {
	execute(): void {
		startAdEngine();
		this.setAdStack();
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'sponsored_logo' });
	}
}
