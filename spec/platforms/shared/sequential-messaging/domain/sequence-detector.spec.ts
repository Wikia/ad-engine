import { expect } from 'chai';
import { SequenceDetector } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-detector';

describe('Sequence Detector', () => {
	it('Is Ad Sequential Check', () => {
		const icSequentialMessaging = {
			'5854346762': {
				length: '4',
			},
		};

		const sd = new SequenceDetector(icSequentialMessaging);

		expect(sd).to.be.instanceof(SequenceDetector);
		expect(sd.isAdSequential('5854346762')).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
