import { Injectable } from '@wikia/dependency-injection';
import { IcSequentialMessaging } from './data-structures/ic-sequential-messaging';
import { SequenceDetector } from './domain/sequence-detector';

@Injectable()
export class DetectorFactory {
	constructor(private icSequentialMessaging: IcSequentialMessaging) {}

	makeSequenceDetector(): SequenceDetector {
		if (this.icSequentialMessaging == null) {
			return new SequenceDetector([]);
		}

		const sequentialLineItemsIds: string[] = [];

		for (const item of Object.keys(this.icSequentialMessaging)) {
			sequentialLineItemsIds.push(item);
		}

		return new SequenceDetector(sequentialLineItemsIds);
	}
}
