import { adClickTracker, communicationService, Dictionary, globalAction } from '@wikia/ad-engine';
import { props } from 'ts-action';
import { trackingUrls } from '../../setup/tracking-urls';
import { DataWarehouseTracker } from '../data-warehouse';

const adClickedAction = globalAction('[AdEngine] Ad clicked', props<Dictionary>());

export function adClickDwTracker(dwTracker: DataWarehouseTracker): void {
	adClickTracker.register(({ data }: Dictionary) => {
		// event listeners might be outside of AdEngine, f.e. in the SilverSurfer interactions module
		communicationService.dispatch(adClickedAction(data));
		dwTracker.track(data, trackingUrls.AD_ENG_AD_INFO);
	});
}
