import { targetingService } from '@wikia/ad-engine';

export function addExperimentGroupToTargeting(experimentGroup: string) {
	const targetingData = targetingService.get('experiment_groups') || [];
	targetingData.push(experimentGroup);

	targetingService.set('experiment_groups', targetingData);
}
