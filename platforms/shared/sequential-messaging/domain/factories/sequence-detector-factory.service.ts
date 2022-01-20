import { Injectable } from '@wikia/dependency-injection';
import { IcSequentialMessaging } from '../data-structures/ic-sequential-messaging';
import { SequenceDetector } from '../sequence-detector';

@Injectable()
export class SequenceDetectorFactory {
	constructor(private icSequentialMessaging: IcSequentialMessaging) {}

	makeSequenceDetector(): SequenceDetector {
		const sequentialLineItemsIds: string[] = [];

		for (const item of Object.keys(this.icSequentialMessaging)) {
			sequentialLineItemsIds.push(item);
		}

		return new SequenceDetector(sequentialLineItemsIds);
	}
}
