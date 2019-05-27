import { expect } from 'chai';
import { instantConfig } from '../../../src/ad-services/instant-config';

describe('Instant Config service', () => {
	const config = {
		foo: 'bar',
	};

	beforeEach(() => {
		instantConfig.config = config;
	});

	afterEach(() => {
		instantConfig.config = null;
	});

	it('get defined config', async () => {
		const value = await instantConfig.getConfig();

		expect(value).to.equal(config);
	});

	it('get single value from config', async () => {
		const value = await instantConfig.get('foo');

		expect(value).to.equal('bar');
	});
});
