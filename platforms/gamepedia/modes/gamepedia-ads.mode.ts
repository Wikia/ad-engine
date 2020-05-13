import { AdsMode, startAdEngine, wadRunner } from '@platforms/shared';
import {
	bidders,
	confiant,
	context,
	durationMedia,
	facebookPixel,
	iasPublisherOptimization,
	identityLibrary,
	permutive,
	taxonomyService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { hideAllAdSlots } from '../templates/hide-all-ad-slots';
import { editModeManager } from '../utils/edit-mode-manager';

@Injectable()
export class GamepediaAdsMode implements AdsMode {
	handleAds(): void {
		editModeManager.onActivate(() => hideAllAdSlots());

		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.requestBids());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(wadRunner.call());

		facebookPixel.call();
		permutive.call();
		iasPublisherOptimization.call();
		identityLibrary.call();
		confiant.call();
		durationMedia.call();

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'cdm-zone-01' });
		context.push('state.adStack', { id: 'cdm-zone-02' });
		context.push('state.adStack', { id: 'cdm-zone-03' });
		context.push('state.adStack', { id: 'cdm-zone-04' });
		context.push('state.adStack', { id: 'cdm-zone-06' });
	}
}
