import { buildPromisedTimeout, PromisedTimeout } from '@wikia/core/utils';
import { expect } from 'chai';
import { SinonFakeTimers } from 'sinon';

/**
 * The use of Promise.resolve() is required for testing Promise-based code.
 * See https://stackoverflow.com/questions/55440400/
 * testing-that-promise-resolved-not-until-timeout-sinon-chai#
 * for explanation.
 */

describe('buildPromisedTimeout', () => {
	let clock: SinonFakeTimers;

	beforeEach(() => {
		clock = global.sandbox.useFakeTimers();
	});

	it('should resolve after provided time passes', async () => {
		let resolved = false;
		const timeout: PromisedTimeout<number> = buildPromisedTimeout(1000);

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
		const timeout: PromisedTimeout<number> = buildPromisedTimeout(time);

		timeout.promise.then((timeoutTime) => {
			result = timeoutTime;
		});

		expect(result).to.be.undefined;

		clock.tick(time);
		await Promise.resolve();
		expect(result).to.equal(time);
	});

	it('should be cancellable', async () => {
		let result = 0;
		const timeout: PromisedTimeout<number> = buildPromisedTimeout(1000);

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
		const timeout: PromisedTimeout<number> = buildPromisedTimeout(time);

		clock.tick(time);
		await Promise.resolve();

		timeout.cancel();
	});
});
