import { DiProcess } from '@wikia/ad-engine';
import { hideAllAdSlots } from '../templates/hide-all-ad-slots';

export class GamepediaNoAdsMode implements DiProcess {
	execute(): void {
		hideAllAdSlots();
	}
}
