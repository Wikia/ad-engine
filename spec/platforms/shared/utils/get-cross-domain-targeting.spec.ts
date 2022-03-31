import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';

import { getCrossDomainTargeting } from '../../../../platforms/shared/utils/get-cross-domain-targeting';

describe('getCrossDomainTargeting', () => {
	let mockedStorage;
	const sandbox: SinonSandbox = createSandbox();

	beforeEach(() => {
		mockedStorage = {
			getItem: sandbox.stub().returns(undefined),
		} as any;
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('returns Cortex RPG key-val set to "no" when cookie is not set', () => {
		const expectedTargeting = {
			'cortex-visitor': 'no',
		};

		expect(getCrossDomainTargeting(mockedStorage)).to.deep.equal(expectedTargeting);
	});

	it('returns Cortex RPG key-val set to "yes" when cookie is set', () => {
		mockedStorage = {
			getItem: sandbox.stub().returns('1'),
		} as any;

		const expectedTargeting = {
			'cortex-visitor': 'yes',
		};

		expect(getCrossDomainTargeting(mockedStorage)).to.deep.equal(expectedTargeting);
	});
});
