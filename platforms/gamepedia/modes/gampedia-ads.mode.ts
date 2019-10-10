import { AdsMode, biddersDelay, startAdEngine } from '@platforms/shared';
import { bidders, confiant, context, durationMedia, taxonomyService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { hideAllAdSlots } from '../templates/hide-all-ad-slots';
import { editModeManager } from '../utils/edit-mode-manager';

@Injectable()
export class GamepediaAdsMode implements AdsMode {
	handleAds(): void {
		editModeManager.onActivate(() => hideAllAdSlots());
		this.callExternals();
		startAdEngine();
		this.setAdStack();
	}

	private callExternals(): void {
		bidders.requestBids({
			responseListener: biddersDelay.markAsReady,
		});

		confiant.call();
		durationMedia.call();

		taxonomyService.configurePageLevelTargeting();
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'cdm-zone-01' });
		context.push('state.adStack', { id: 'cdm-zone-02' });
		context.push('state.adStack', { id: 'cdm-zone-03' });
		context.push('state.adStack', { id: 'cdm-zone-04' });
		context.push('state.adStack', { id: 'cdm-zone-06' });
	}
}
