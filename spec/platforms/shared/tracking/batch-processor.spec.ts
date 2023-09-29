import { BatchProcessor } from '@wikia/platforms/shared/tracking/batch-processor';
import { expect } from 'chai';

const eventsArray = [{ url: '1111' }, { url: '2222' }, { url: '3333' }, { url: '4444' }];

describe('batch-processor', () => {
	describe('batch tasks', async () => {
		it('split tasks into smaller batches', async () => {
			const batchProcessor = new BatchProcessor(eventsArray, 3, 0);

			expect(batchProcessor.batchedTasks.length).to.be.eq(2);
			expect(batchProcessor.batchedTasks[0]).to.deep.equal([
				{ url: '1111' },
				{ url: '2222' },
				{ url: '3333' },
			]);
			expect(batchProcessor.batchedTasks[1]).to.deep.equal([{ url: '4444' }]);
		});

		it('do not split when batch smaller than array size', async () => {
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
});
