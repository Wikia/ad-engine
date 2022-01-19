import { Injectable } from '@wikia/dependency-injection';
import { SequenceDetector } from './domain/sequence-detector';

@Injectable()
export class DetectorFactory {
	constructor(private icbmLineItems: IcSequentialMessaging) {}

	makeSequenceDetector(): SequenceDetector {
		if (this.icbmLineItems == null) {
			return new SequenceDetector([]);
		}

		const sequentialLineItemsIds: string[] = [];

		for (const item of Object.keys(this.icbmLineItems)) {
			sequentialLineItemsIds.push(item);
		}

		return new SequenceDetector(sequentialLineItemsIds);
	}
}
