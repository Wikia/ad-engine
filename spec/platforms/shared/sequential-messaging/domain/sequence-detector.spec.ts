import { expect } from 'chai';
import { NewSequenceStateHandler } from '../../../../../platforms/shared/sequential-messaging/domain/services/new-sequence-state-handler';
import { SequentialMessagingConfig } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/sequential-messaging-config';
import { Sequence } from '../../../../../platforms/shared/sequential-messaging/domain/data-structures/sequence';

describe('New Sequence Detector', () => {
	it('Is Ad Sequential Check', () => {
		const config: SequentialMessagingConfig = {
			'5854346762': {
				lastStepId: '1234567890',
				targeting: { cid: 'sequential_messaging' },
			},
		};

		const sequence: Sequence = { id: '5854346762', stepId: '123456789' };
		const notSequence: Sequence = { id: '0', stepId: '123456789' };
		const sd = new NewSequenceStateHandler(config);

		expect(sd).to.be.instanceof(NewSequenceStateHandler);
		expect(sd.handleState(sequence)).to.be.true;
		expect(sd.handleState(notSequence)).to.be.false;
	});
});
