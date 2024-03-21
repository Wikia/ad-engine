import {
	BaseServiceSetup,
	context,
	defineExperiment,
	Experiment,
	getExperiment,
	utils,
} from '@wikia/ad-engine';
import { addExperimentGroupToTargeting } from '../utils/experiment-targeting';

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
		if (this.isExperimentEnabledGlobally()) {
			this.prepareExperimentEnabledGlobally();
			return;
		}

		this.setupExperimentVariants();
		this.activeExperimentVariant = getExperiment(this.experimentVariants);

		if (!this.isExperimentEnabled()) return;

		addExperimentGroupToTargeting(this.activeExperimentVariant.name);

		if (this.isControlVariant()) {
			utils.logger(logGroup, 'Experiment but control group', this.activeExperimentVariant.name);
		} else {
			utils.logger(logGroup, 'Experiment - active group', this.activeExperimentVariant.name);
			this.enableAuctionSplit();
		}
	}

	private prepareExperimentEnabledGlobally() {
		this.enableAuctionSplit();
		addExperimentGroupToTargeting(
			`bid-auction-split-${this.isMobile ? 'mobile' : 'desktop'}-globally`,
		);
		utils.logger(logGroup, 'Experiment - active globally');
	}

	private enableAuctionSplit() {
		context.set('custom.bidAuctionSplitEnabled', true);
		context.set('events.pushOnScroll.threshold', 250);
	}

	private setupExperimentVariants() {
		if (this.isMobile) {
			this.setupMobileExperimentVariants();
		} else {
			this.setupDesktopExperimentVariants();
		}
	}

	private setupDesktopExperimentVariants() {
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

	private setupMobileExperimentVariants() {
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
	}

	private isExperimentEnabled() {
		return (
			this.instantConfig.get('icExperiments', []).includes('bidAuctionSplit') &&
			this.activeExperimentVariant
		);
	}

	private isExperimentEnabledGlobally() {
		return this.instantConfig.get('icExperiments', []).includes('bidAuctionSplitGlobally');
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
