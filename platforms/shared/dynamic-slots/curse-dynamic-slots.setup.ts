import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../slots/slots-context';

@Injectable()
export class CurseDynamicSlotsSetup implements DiProcess {
	private uapFirstCallSlotName = 'cdm-zone-01';

	constructor() {}

	execute(): void {
		this.configureUap();
	}

	configureUap(): void {
		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];

		slotsContext.addSlotSize(this.uapFirstCallSlotName, uapSize);
	}
}
