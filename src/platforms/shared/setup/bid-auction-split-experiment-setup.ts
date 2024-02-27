import { addExperimentGroupToTargeting } from '@platforms/shared';
import {
	BaseServiceSetup,
	context,
	defineExperiment,
	Experiment,
	getExperiment,
	utils,
} from '@wikia/ad-engine';

const logGroup = 'BidAuctionSplitExperimentSetup';
type RunningExperimentType = Experiment | null | undefined;

export class BidAuctionSplitExperimentSetup extends BaseServiceSetup {
	private isMobile = context.get('state.isMobile');
	private experimentVariants;

	private experimentVariantNames = {
		mobileControl: 'bid-auction-split-mobile-control',
		mobileActive: 'bid-auction-split-mobile-active',
		desktopControl: 'bid-auction-split-desktop-control',
		desktopActive: 'bid-auction-split-desktop-active',
	};

	private activeExperimentVariant: RunningExperimentType;

	call(): void {
		this.setupExperimentVariants();
		this.activeExperimentVariant = getExperiment(this.experimentVariants);

		if (this.isExperimentEnabled()) {
			addExperimentGroupToTargeting(this.activeExperimentVariant.name);

			if (this.isControlVariant()) {
				utils.logger(logGroup, 'Experiment but control group', this.activeExperimentVariant.name);
			} else {
				utils.logger(logGroup, 'Experiment - active group', this.activeExperimentVariant.name);
				context.set('custom.bidAuctionSplitEnabled', true);
			}
		}
	}

	private setupExperimentVariants() {
		if (this.isMobile) {
			this.experimentVariants = [
				defineExperiment({
					name: this.experimentVariantNames.mobileActive,
					buckets: ['c', 'd'],
				}),
				defineExperiment({
					name: this.experimentVariantNames.mobileControl,
					buckets: ['e', 'f', 'g', 'h'],
				}),
			];
		} else {
			this.experimentVariants = [
				defineExperiment({
					name: this.experimentVariantNames.desktopActive,
					buckets: ['A', 'B'],
				}),
				defineExperiment({
					name: this.experimentVariantNames.desktopControl,
					buckets: ['C', 'D', 'E', 'F'],
				}),
			];
		}
	}

	private isExperimentEnabled() {
		return (
			this.instantConfig.get('icExperiments', []).includes('bidAuctionSplit') &&
			this.activeExperimentVariant
		);
	}

	private isControlVariant() {
		return this.activeExperimentVariant?.name === this.getControlVariantName();
	}

	private getControlVariantName(): string {
		return this.isMobile
			? this.experimentVariantNames.mobileControl
			: this.experimentVariantNames.desktopControl;
	}
}
