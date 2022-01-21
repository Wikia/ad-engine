import { expect } from 'chai';
import { NewSequenceDetector } from '../../../../../platforms/shared/sequential-messaging/domain/services/new-sequence-detector';

describe('New Sequence Detector', () => {
	it('Is Ad Sequential Check', () => {
		const icSequentialMessaging = {
			'5854346762': {
				length: '4',
			},
		};

		const sd = new NewSequenceDetector(icSequentialMessaging);

		expect(sd).to.be.instanceof(NewSequenceDetector);
		expect(sd.isAdSequential('5854346762')).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
