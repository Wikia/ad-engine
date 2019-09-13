import { DataWarehouseTracker } from './data-warehouse';

/**
 * Tracks WAD rec detection result to GA and DW
 * @param {boolean} isBabDetected
 * @returns {void}
 */
export function trackBab(isBabDetected): void {
	const dataWarehouseTracker = new DataWarehouseTracker();

	dataWarehouseTracker.track({
		category: 'ads-babdetector-detection',
		action: 'impression',
		label: isBabDetected ? 'Yes' : 'No',
		value: 0,
	});
}
