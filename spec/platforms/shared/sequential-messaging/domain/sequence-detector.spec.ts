import { expect } from 'chai';
import { SequenceDetector } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-detector';

describe('Sequence Detector', () => {
	it('Is Ad Sequential Check', () => {
		const line_item_id = '1234567890';

		const sd = new SequenceDetector([line_item_id]);

		expect(sd).to.not.be.null;
		expect(sd.isAdSequential(line_item_id)).to.be.true;
		expect(sd.isAdSequential('0')).to.be.false;
	});
});
