import { DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { PageTracker } from '../tracking/page-tracker';
import { DataWarehouseTracker } from '../tracking/data-warehouse';

@Injectable()
export class IframeDetectorSetup implements DiProcess {
	execute(): void {
		const pageInIframe = document.documentElement.classList.contains('in-iframe');
		if (pageInIframe) {
			const dataWarehouseTracker = new DataWarehouseTracker();

			const pageTracker = new PageTracker(dataWarehouseTracker);

			pageTracker.trackProp('adengine_in_iframe', '1');
		}
	}
}
