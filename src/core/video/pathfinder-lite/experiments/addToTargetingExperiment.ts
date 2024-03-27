import { targetingService } from '../../../services';

export default function addToTargetingExperiment(experimentGroup: string): void {
	const targetingData = targetingService.get('experiment_groups') || [];
	targetingData.push(experimentGroup);

	targetingService.set('experiment_groups', targetingData);
}
