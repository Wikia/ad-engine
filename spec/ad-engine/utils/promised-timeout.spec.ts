import { utils } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox, SinonFakeTimers, SinonSandbox } from 'sinon';

/**
 * The use of Promise.resolve() is required for testing Promise-based code.
 * See https://stackoverflow.com/questions/55440400/
 * testing-that-promise-resolved-not-until-timeout-sinon-chai#
 * for explanation.
 */

describe('buildPromisedTimeout', () => {
	let sandbox: SinonSandbox;
	let clock: SinonFakeTimers;

	beforeEach(() => {
		sandbox = createSandbox();
		clock = sandbox.useFakeTimers();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should resolve after provided time passes', async () => {
		let resolved = false;
		const timeout: utils.PromisedTimeout<number> = utils.buildPromisedTimeout(1000);

		timeout.promise.then(() => {
			resolved = true;
		});

		expect(resolved).to.equal(false);

		clock.tick(800);
		await Promise.resolve();
		expect(resolved).to.equal(false);

		clock.tick(200);
		await Promise.resolve();
		expect(resolved).to.equal(true);
	});

	it('should resolve to timeout time', async () => {
		let result: number;
		const time = 1000;
		const timeout: utils.PromisedTimeout<number> = utils.buildPromisedTimeout(time);

		timeout.promise.then((time) => {
			result = time;
		});

		expect(result).to.be.undefined;

		clock.tick(time);
		await Promise.resolve();
		expect(result).to.equal(time);
	});

	it('should be cancellable', async () => {
		let result = 0;
		const timeout: utils.PromisedTimeout<number> = utils.buildPromisedTimeout(1000);

		timeout.promise.then((time) => {
			result = time;
		});

		expect(result).to.equal(0);

		clock.tick(800);
		await Promise.resolve();
		expect(result).to.equal(0);

		timeout.cancel();

		clock.tick(200);
		await Promise.resolve();
		expect(result).to.equal(0);
	});

	it('should be cancellable after it resolves', async () => {
		const time = 1000;
		const timeout: utils.PromisedTimeout<number> = utils.buildPromisedTimeout(time);

		clock.tick(time);
		await Promise.resolve();

		timeout.cancel();
	});
});
