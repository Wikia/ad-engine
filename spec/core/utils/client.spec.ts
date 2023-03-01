import { client } from '@wikia/core/utils/client';
import { expect } from 'chai';

describe('client', () => {
	it('checkBlocking works correctly', async () => {
		let blocker = false;
		let notBlocked = false;

		await client.checkBlocking(
			() => {
				blocker = true;
			},
			() => {
				notBlocked = true;
			},
		);

		// Failed to load plugin because lack of window = simulate blocking extension
		// by disabling import
		expect(blocker).to.equal(true);
		expect(notBlocked).to.equal(false);
	});
});
