import { Injectable } from '@wikia/dependency-injection';
import { DynamicSlotsSetup } from './_dynamic-slots.setup';
import { UapSetup } from './uap/_uap.setup';

@Injectable()
export class SportsDynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(private uapSetup: UapSetup) {}

	configureDynamicSlots(): void {
		this.uapSetup.configureUap();
	}
}
