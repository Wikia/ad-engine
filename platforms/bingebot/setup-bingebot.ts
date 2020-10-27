import { globalAction } from '@wikia/ad-engine';
import { props } from 'ts-action';

interface ViewRenderedProps {
	viewType: string;
	beaconId: string;
	pvNumber: number;
	pvNumberGlobal: number;
	pvUID: string;
	sessionId: string;
}

interface AdSlotInjectedProps {
	slotId: string;
}

export const beforeViewChange = globalAction('[BingeBot] before view change');
export const viewRendered = globalAction('[BingeBot] view rendered', props<ViewRenderedProps>());
export const adSlotInjected = globalAction(
	'[BingeBot] ad slot injected',
	props<AdSlotInjectedProps>(),
);
export const destroyAdSlot = globalAction(
	'[BingeBot] destroy ad slot',
	props<AdSlotInjectedProps>(),
);
