import { DataWarehouseTracker } from '@platforms/shared';
import { InstantConfigService, interventionTracker } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdSizeTracker } from '../../../../shared/tracking/ad-size-tracker';
import { LabradorTracker } from '../../../../shared/tracking/labrador-tracker';
import { adClickDwTracker } from '../../../../shared/tracking/trackers/ad-click-tracker';
import { ctaDwTracker } from '../../../../shared/tracking/trackers/cta-tracker';
import { experimentGroupsTracker } from '../../../../shared/tracking/trackers/experiment-group-tracker';
import { googleTopicsTracker } from '../../../../shared/tracking/trackers/google-topics-tracker';
import { identityDwTracker } from '../../../../shared/tracking/trackers/identity-tracker';
import { porvataDwTracker } from '../../../../shared/tracking/trackers/porvata-tracker';
import { postmessageTrackingDwTracker } from '../../../../shared/tracking/trackers/postmessage-tracker';
import { viewabilityDwTracker } from '../../../../shared/tracking/trackers/viewability-tracker';

@Injectable()
export class TrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private adSizeTracker: AdSizeTracker,
		private dwTracker: DataWarehouseTracker,
		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		porvataDwTracker(this.dwTracker);
		viewabilityDwTracker(this.dwTracker);
		postmessageTrackingDwTracker(this.dwTracker);
		experimentGroupsTracker(this.labradorTracker);
		this.interventionTracker();
		adClickDwTracker(this.dwTracker);
		ctaDwTracker(this.dwTracker);
		identityDwTracker(this.dwTracker, this.instantConfig);
		googleTopicsTracker(this.dwTracker);
		this.adSizeTracker.init();
	}

	private interventionTracker(): void {
		interventionTracker.register();
	}
}
