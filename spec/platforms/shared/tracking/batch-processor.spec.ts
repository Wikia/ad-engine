import { BatchProcessor } from '@wikia/platforms/shared/tracking/batch-processor';
import { expect } from 'chai';
import sinon from 'sinon';

const eventsArray = [{ url: '1111' }, { url: '2222' }, { url: '3333' }, { url: '4444' }];

describe('batch-processor', () => {
	let clock;

	before(() => {
		clock = sinon.useFakeTimers({
			toFake: ['setInterval'],
		});
	});

	after(() => {
		clock.restore();
	});

	describe('batch tasks', () => {
		it('split tasks into smaller batches', () => {
			const batchProcessor = new BatchProcessor(eventsArray, 3, 0);

			expect(batchProcessor.batchedTasks.length).to.be.eq(2);
			expect(batchProcessor.batchedTasks[0]).to.deep.equal([
				{ url: '1111' },
				{ url: '2222' },
				{ url: '3333' },
			]);
			expect(batchProcessor.batchedTasks[1]).to.deep.equal([{ url: '4444' }]);
		});

		it('do not split when batch smaller than array size', () => {
			const batchProcessor = new BatchProcessor(eventsArray, 5, 0);

			expect(batchProcessor.batchedTasks.length).to.be.eq(1);
			expect(batchProcessor.batchedTasks[0]).to.deep.equal([
				{ url: '1111' },
				{ url: '2222' },
				{ url: '3333' },
				{ url: '4444' },
			]);
		});
	});

	describe('dispatch events in batches', async () => {
		const sendEventSpy = sinon.spy();

		it('events sent count', async () => {
			const batchProcessor = new BatchProcessor(eventsArray, 2, 1);

			await batchProcessor.dispatchEventsWithTimeout(sendEventSpy);

			clock.tick(3);

			expect(sendEventSpy.callCount).to.be.eq(4);
		});
	});
});
