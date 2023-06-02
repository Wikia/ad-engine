import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { desktopSlots } from './deviceDependent/desktop-slots.setup';
import { mobileSlots } from './deviceDependent/mobile-slots.setup';

@Injectable()
export class MetacriticNeutronSlotsContextV2Setup implements DiProcess {
	execute(): void {
		context.set('slots', context.get('state.isMobile') ? mobileSlots : desktopSlots);
	}
}
