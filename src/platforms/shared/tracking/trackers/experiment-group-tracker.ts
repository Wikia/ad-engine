import { InstantConfigCacheStorage, targetingService } from '@wikia/ad-engine';
import { LabradorTracker } from '../labrador-tracker';

export function experimentGroupsTracker(labradorTracker: LabradorTracker): void {
	const cacheStorage = InstantConfigCacheStorage.make();
	const experimentsGroups = [
		...cacheStorage.getSamplingResults(),
		...(targetingService.get('experiment_groups') || []),
	].join(';');

	if (experimentsGroups) {
		labradorTracker.track(experimentsGroups);
	}
}
