import { IcSequentialMessaging } from './data-structures/ic-sequential-messaging';

export class SequenceDetector {
	sequentialLineItemsIds: string[] = [];

	constructor(icSequentialMessaging: IcSequentialMessaging) {
		for (const item of Object.keys(icSequentialMessaging)) {
			this.sequentialLineItemsIds.push(item);
		}
	}

	isAdSequential(line_item_id: string): boolean {
		return this.sequentialLineItemsIds.includes(line_item_id);
	}
}
