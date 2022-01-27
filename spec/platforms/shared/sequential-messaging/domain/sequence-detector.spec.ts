import { expect } from 'chai';
import { NewSequenceDetector } from '../../../../../platforms/shared/sequential-messaging/domain/services/new-sequence-detector';
import { SequentialMessagingConfig } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/sequential-messaging-config';

describe('New Sequence Detector', () => {
	it('Is Ad Sequential Check', () => {
		const config: SequentialMessagingConfig = {
			'5854346762': {
				length: '4',
				targeting: { cid: 'sequential_messaging' },
			},
		};

		const sd = new NewSequenceDetector(config);

		expect(sd).to.be.instanceof(NewSequenceDetector);
		expect(sd.isAdSequential('5854346762')).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
