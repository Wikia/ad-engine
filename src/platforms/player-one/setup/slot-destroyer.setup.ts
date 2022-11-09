import { DiProcess, utils } from '@wikia/ad-engine';

export class SlotDestroyerSetup implements DiProcess {
	private static LOG_GROUP = 'slot-destroyer';

	execute(): void {
		if (!window.googletag) {
			utils.logger(SlotDestroyerSetup.LOG_GROUP, 'GoogleTag is not defined, aborting!');
			return;
		}

		window.googletag.destroySlots();
	}
}
