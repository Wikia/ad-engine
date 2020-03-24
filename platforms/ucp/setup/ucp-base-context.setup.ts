import { BaseContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpBaseContextSetup extends BaseContextSetup {
	configureBaseContext(isMobile = false): void {
		super.configureBaseContext(isMobile);

		const wiki: MediaWikiAdsContext = context.get('wiki');

		context.set('targeting.skin', this.getSkin(wiki));
		context.set(
			'options.floatingMedrecDestroyable',
			this.instantConfig.get('icFloatingMedrecDestroyable'),
		);
		// sourced from front/scripts/shared/tracking/Tracker.js getUserIdForInternalTracking()
		context.set(
			'userId',
			(window.mw as any).config.get('wgTrackID') || (window.mw as any).config.get('wgUserId'),
		);
	}

	private getSkin(adsContext: MediaWikiAdsContext): string {
		let wikiSkin = adsContext.skin;
		const skins = ['hydra', 'oasis'];

		skins.forEach((skin) => {
			if (adsContext.skin.includes(skin)) {
				wikiSkin = skin;
			}
		});

		return wikiSkin;
	}
}
