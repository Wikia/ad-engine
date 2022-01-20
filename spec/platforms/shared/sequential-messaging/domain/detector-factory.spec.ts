import { expect } from 'chai';
import { SequenceDetectorFactory } from '../../../../../platforms/shared/sequential-messaging/domain/factories/sequence-detector-factory.service';
import { SequenceDetector } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-detector';

describe('Sequence Detector Factory', () => {
	it('Create SequenceDetector', () => {
		const icSequentialMessaging = {
			5854346762: {
				length: 4,
			},
		};

		const df = new SequenceDetectorFactory(icSequentialMessaging);
		const sd = df.makeSequenceDetector();

		expect(sd).to.be.instanceof(SequenceDetector);
		expect(sd.isAdSequential('5854346762')).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
