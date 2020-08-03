import { slotsContext, SlotsStateSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotSlotsStateSetup implements SlotsStateSetup {
	constructor() {}

	execute(): void {
		slotsContext.setState('sponsored_logo', true);
	}
}
