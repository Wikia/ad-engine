import { Bidders, InstantConfigService, interventionTracker } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdSizeTracker } from './ad-size-tracker';
import { DataWarehouseTracker } from './data-warehouse';
import { LabradorTracker } from './labrador-tracker';

import { adClickDwTracker } from './trackers/ad-click-tracker';
import { bidderDwTracker } from './trackers/bidder-tracker';
import { ctaDwTracker } from './trackers/cta-tracker';
import { experimentGroupsTracker } from './trackers/experiment-group-tracker';
import { googleTopicsTracker } from './trackers/google-topics-tracker';
import { identityDwTracker } from './trackers/identity-tracker';
import { keyValsDwTracker } from './trackers/keyvals-tracker';
import { porvataDwTracker } from './trackers/porvata-tracker';
import { postmessageTrackingDwTracker } from './trackers/postmessage-tracker';
import { slotDwTracker } from './trackers/slot-tracker';

@Injectable()
export class TrackingSetup {
	constructor(
		private labradorTracker: LabradorTracker,
		private adSizeTracker: AdSizeTracker,
		private dwTracker: DataWarehouseTracker,
		private bidders: Bidders,
		private instantConfig: InstantConfigService = null,
	) {}

	execute(): void {
		porvataDwTracker(this.dwTracker);
		slotDwTracker(this.dwTracker, this.bidders);
		bidderDwTracker(this.dwTracker);
		postmessageTrackingDwTracker(this.dwTracker);
		experimentGroupsTracker(this.labradorTracker);
		this.interventionTracker();
		adClickDwTracker(this.dwTracker);
		ctaDwTracker(this.dwTracker);
		identityDwTracker(this.dwTracker, this.instantConfig);
		keyValsDwTracker(this.dwTracker);
		googleTopicsTracker(this.dwTracker);
		this.adSizeTracker.init();
	}

	private interventionTracker(): void {
		interventionTracker.register();
	}
}
