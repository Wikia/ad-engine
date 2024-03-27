import { DataWarehouseTracker } from '../data-warehouse';

/**
 * Tracks WAD rec detection result to GA and DW
 * @param {boolean} isBabDetected
 * @param {'wad-runner' | 'bt'} detector source of Ad Block detection
 * @returns {void}
 */
export function trackBab(
	isBabDetected: boolean,
	detector: 'wad-runner' | 'wad-runner-bt' | 'bt',
): void {
	const dataWarehouseTracker = new DataWarehouseTracker();

	dataWarehouseTracker.track({
		category: 'ads-babdetector-detection',
		action: 'impression',
		label: isBabDetected ? 'Yes' : 'No',
		value: detector,
	});
}
