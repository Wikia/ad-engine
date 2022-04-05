import { expect } from 'chai';
import { context, externalLogger } from '../../../src/ad-engine';

describe('External logger', () => {
	beforeEach(() => {
		context.set('services.someService.sampling', 10);
	});

	afterEach(() => {
		context.set('services.someService.sampling', undefined);
	});

	it('External logger is disabled when there is no sampling setting and random number is set to 0', () => {
		expect(externalLogger.isEnabled('notExistingSetting', 0)).to.equal(false);
	});

	it('External logger is disabled when there is no sampling setting', () => {
		expect(externalLogger.isEnabled('notExistingSetting', 1)).to.equal(false);
	});

	it('External logger is disabled when random number is higher than sampling', () => {
		expect(externalLogger.isEnabled('notExistingSetting', 11)).to.equal(false);
	});

	it('External logger is enabled', () => {
		expect(externalLogger.isEnabled('services.someService.sampling', 9)).to.equal(true);
	});

	it('External logger is enabled when sampling is set to 100', () => {
		context.set('services.someService.sampling', 100);
		expect(externalLogger.isEnabled('services.someService.sampling', 9)).to.equal(true);
	});
});
