import {
	Dictionary,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	viewabilityPropertiesTrackingMiddleware,
	viewabilityTracker,
	viewabilityTrackingMiddleware,
} from '@wikia/ad-engine';
import { DataWarehouseTracker } from './data-warehouse';

const slotTrackingURL = 'https://beacon.wikia-services.com/__track/special/adengadinfo';
const viewabilityUrl = 'https://beacon.wikia-services.com/__track/special/adengviewability';

export const registerSlotTracker = () => {
	const dataWarehouseTracker = new DataWarehouseTracker();

	slotTracker.onChangeStatusToTrack.push('top-conflict');

	slotTracker
		.add(slotTrackingMiddleware)
		.add(slotPropertiesTrackingMiddleware)
		.add(slotBiddersTrackingMiddleware)
		.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, slotTrackingURL);
		});
};

export const registerViewabilityTracker = () => {
	const dataWarehouseTracker = new DataWarehouseTracker();

	viewabilityTracker
		.add(viewabilityTrackingMiddleware)
		.add(viewabilityPropertiesTrackingMiddleware)
		.register(({ data }: Dictionary) => {
			dataWarehouseTracker.track(data, viewabilityUrl);
		});
};
