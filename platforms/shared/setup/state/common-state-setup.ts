import { Injectable } from '@wikia/dependency-injection';
import { StateSetup } from './_state.setup';
import { BiddersStateSetup } from './bidders/_bidders-state.setup';
import { SlotsStateSetup } from './slots/_slots-state.setup';

@Injectable()
export class CommonStateSetup implements StateSetup {
	constructor(
		private slotsStateSetup: SlotsStateSetup,
		private biddersStateSetup: BiddersStateSetup,
	) {}

	configureState(): void {
		this.slotsStateSetup.configureSlotsState();
		this.biddersStateSetup.configureBiddersState();
	}
}
