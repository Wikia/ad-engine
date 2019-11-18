import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../slots/slots-context';

@Injectable()
export class CurseUapSetup {
	private firstCallSlotName = 'cdm-zone-01';

	constructor() {}

	configureUap(): void {
		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];

		slotsContext.addSlotSize(this.firstCallSlotName, uapSize);
	}
}
