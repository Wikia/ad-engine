import {
	defineExperiment,
	Experiment,
	getExperiment,
	InstantConfigService,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

type RunningExperimentType = Experiment | null | undefined;

const logGroup = 'UcpDesktopBfaaExperiment';

@Injectable()
export class UcpDesktopBfaaExperiment {
	private pathfinderExperimentVariantNames = {
		// @TODO: Need to figure out sampling size issue
		control: 'bfaa-desktop-experiment-control',
		active: 'bfaa-desktop-experiment-active',
	};

	private pathfinderExperimentVariants = [
		defineExperiment({
			name: this.pathfinderExperimentVariantNames.active,
			buckets: ['k', 'l'],
		}),
		defineExperiment({
			name: this.pathfinderExperimentVariantNames.control,
			buckets: ['i', 'j', 'u', 'v'],
		}),
	];

	private pathfinderActiveExperimentVariant: RunningExperimentType = getExperiment(
		this.pathfinderExperimentVariants,
	);

	constructor(private instantConfig: InstantConfigService) {}

	private addToTargeting(experimentGroup: string) {
		const targetingData = targetingService.get('experiment_groups') || [];
		targetingData.push(experimentGroup);

		targetingService.set('experiment_groups', targetingData);
	}

	private isExperimentEnabled() {
		return (
			this.instantConfig.get('icExperiments', []).includes('stickyBfaa') &&
			this.pathfinderActiveExperimentVariant
		);
	}

	private isPathfinderControlVariant() {
		return (
			this.pathfinderActiveExperimentVariant?.name === this.pathfinderExperimentVariantNames.control
		);
	}

	public isAdSticky() {
		if (this.isExperimentEnabled()) {
			utils.logger(logGroup, 'Experiment sticky bfaa enabled');

			if (this.isPathfinderControlVariant()) {
				utils.logger(logGroup, 'Control triggered');
				this.addToTargeting(this.pathfinderExperimentVariantNames.control);
				return false;
			} else {
				utils.logger(logGroup, 'Active triggered');
				this.addToTargeting(this.pathfinderExperimentVariantNames.active);
				return true;
			}
		}

		return false;
	}
}
