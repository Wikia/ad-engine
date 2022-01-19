import { expect } from 'chai';
import { DetectorFactory } from '../../../../platforms/shared/sequential-messaging/detector-factory';
import { SequenceDetector } from '../../../../platforms/shared/sequential-messaging/domain/sequence-detector';

describe('Detector Factory', () => {
	it('Create SequenceDetector', () => {
		const icSequentialMessaging = {
			5854346762: {
				length: 4,
			},
		};

		const df = new DetectorFactory(icSequentialMessaging);
		const sd = df.makeSequenceDetector();

		expect(sd).to.be.instanceof(SequenceDetector);
		expect(sd.isAdSequential('5854346762')).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});

	it('Create SequenceDetector when instantConfig var is not set', () => {
		const icSequentialMessaging = undefined;

		const df = new DetectorFactory(icSequentialMessaging);
		const sd = df.makeSequenceDetector();

		expect(sd).to.be.instanceof(SequenceDetector);
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
