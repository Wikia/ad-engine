import {
	addToTargetingExperiment,
	defineExperiment,
	Experiment,
	getExperiment,
	InstantConfigService,
	isExperimentEnabled,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

type RunningExperimentType = Experiment | null | undefined;

const logGroup = 'UcpDesktopFloorAdhesionExperiment';

@Injectable()
export class UcpDesktopFloorAdhesionExperiment {
	private pathfinderExperimentVariantNames = {
		control: 'floor-adhesion-desktop-experiment-control',
		active: 'floor-adhesion-desktop-experiment-active',
	};

	private pathfinderActiveExperimentVariant: RunningExperimentType = getExperiment([
		defineExperiment({
			name: this.pathfinderExperimentVariantNames.active,
			buckets: ['m', 'n'],
		}),
		defineExperiment({
			name: this.pathfinderExperimentVariantNames.control,
			buckets: ['o', 'p', 'q', 'r'],
		}),
	]);

	constructor(private instantConfig: InstantConfigService) {}

	private isPathfinderControlVariant() {
		return (
			this.pathfinderActiveExperimentVariant?.name === this.pathfinderExperimentVariantNames.control
		);
	}

	public isFloorAdhesionShowing() {
		if (
			isExperimentEnabled(
				this.instantConfig,
				'floorAdhesion',
				this.pathfinderActiveExperimentVariant,
			)
		) {
			utils.logger(logGroup, 'Experiment floor adhesion enabled');

			if (this.isPathfinderControlVariant()) {
				utils.logger(logGroup, 'Control triggered');
				addToTargetingExperiment(this.pathfinderExperimentVariantNames.control);
				return false;
			} else {
				utils.logger(logGroup, 'Active triggered');
				addToTargetingExperiment(this.pathfinderExperimentVariantNames.active);
				return true;
			}
		}

		return false;
	}
}
