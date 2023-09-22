import { globalTimeout } from '@wikia/core/utils/global-timeout';
import { expect } from 'chai';

describe('globalTimeout', () => {
	it('should set timeout', async () => {
		const label = 'test';
		const timeout = 10000;

		globalTimeout.set(label, timeout);

		expect(globalTimeout.get(label)).to.not.be.undefined;
	});

	it('should not set timeout if already set', async () => {
		const label = 'test';
		const timeout = 10000;

		const prom1 = globalTimeout.set(label, timeout);
		const prom2 = globalTimeout.set(label, timeout);

		expect(prom1).to.be.eq(prom2);
	});
});
