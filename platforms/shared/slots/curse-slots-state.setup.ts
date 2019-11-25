import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SlotsStateSetup } from '../setup/_slots-state.setup';
import { slotsContext } from './slots-context';

@Injectable()
export class CurseSlotsStateSetup implements SlotsStateSetup {
	configureSlotsState(): void {
		slotsContext.setState('cdm-zone-01', true);
		slotsContext.setState('cdm-zone-02', true);
		slotsContext.setState('cdm-zone-03', true);
		slotsContext.setState('cdm-zone-04', !context.get('state.isMobile'));
		slotsContext.setState('cdm-zone-06', true);
		slotsContext.setState('incontent_player', context.get('options.video.isOutstreamEnabled'));
	}
}
