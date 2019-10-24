import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../../../slots/slots-context';
import { UapSetup } from './_uap.setup';
import { UapRestrictor } from './uap-restrictor/uap-restrictor';

@Injectable()
export class CurseUapSetup implements UapSetup {
	private firstCallSlotName = 'cdm-zone-01';

	constructor(private uapRestrictor: UapRestrictor) {}

	configureUap(): void {
		if (!this.uapRestrictor.isUapAllowed()) {
			return;
		}

		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];
		slotsContext.addSlotSize(this.firstCallSlotName, uapSize);
	}
}
