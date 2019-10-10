import { PlatformNoAdsMode } from '@platforms/shared';
import { hideAllAdSlots } from '../templates/hide-all-ad-slots';

export class GamepediaNoAdsMode implements PlatformNoAdsMode {
	handleNoAds(): void {
		hideAllAdSlots();
	}
}
