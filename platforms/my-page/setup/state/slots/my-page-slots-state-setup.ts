import { slotsContext } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MyPageSlotsStateSetup implements DiProcess {
	constructor() {}

	execute(): void {
		slotsContext.setState('top_leaderboard', true);
	}
}
