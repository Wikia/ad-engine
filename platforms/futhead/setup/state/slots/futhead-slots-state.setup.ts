import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FutheadSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		slotsContext.setState('cdm-zone-01', true);
		slotsContext.setState('cdm-zone-02', true);
		slotsContext.setState('cdm-zone-03', true);
		slotsContext.setState('cdm-zone-04', false);
		slotsContext.setState('cdm-zone-06', true);
		slotsContext.setState('incontent_player', context.get('options.video.isOutstreamEnabled'));
	}
}
