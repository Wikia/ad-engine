import { expect } from 'chai';
import { client } from '../../../src/ad-engine/utils/client';

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

	it('isMobileSkin properly detects mobile skins', () => {
		expect(client.isMobileSkin('fandom_mobile')).to.equal(true);
		expect(client.isMobileSkin('anything_else')).to.equal(false);
	});
});
