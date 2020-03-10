import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { Runner, utils } from '../../../src/ad-engine';

describe('runner', () => {
	const defaultTimeout = 2000;
	const sandbox = createSandbox();
	let clock;
	let startTime;
	let resolveTime;

	beforeEach(() => {
		clock = sandbox.useFakeTimers();
		startTime = new Date().getTime();
		resolveTime = startTime + 10000;
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('resolves itself immediately when there are no inhibitors', async () => {
		const runner = new Runner([], defaultTimeout);

		await runner.waitForInhibitors().then(() => (resolveTime = new Date().getTime()));

		const diff = Math.abs(resolveTime - startTime);

		// difference less than 2000 (default timeout) confirms that runner resolved before that timeout
		expect(diff < defaultTimeout).to.equal(true, 'Runner resolved after timeout');
	});

	it('resolves itself after timeout when there are no resolved inhibitors', async () => {
		const runner = new Runner([new Promise(() => {})], defaultTimeout);
		const runnerPromise = runner
			.waitForInhibitors()
			.then(() => (resolveTime = new Date().getTime()));

		clock.tick(defaultTimeout);

		await runnerPromise;

		const diff = Math.abs(resolveTime - startTime);

		// difference bigger than 2000 (default timeout) confirms that runner resolved after that timeout
		expect(diff >= defaultTimeout).to.equal(true, 'Runner resolved before timeout');
	});

	it('resolves itself after all inhibitors', async () => {
		const inhibitor500 = utils.buildPromisedTimeout(500).promise;
		const inhibitor750 = utils.buildPromisedTimeout(750).promise;

		const runner = new Runner([inhibitor500, inhibitor750], defaultTimeout);
		const runnerPromise = runner
			.waitForInhibitors()
			.then(() => (resolveTime = new Date().getTime()));

		clock.tick(1000);

		await runnerPromise;

		const diff = Math.abs(resolveTime - startTime);

		// difference less than 2000 (default timeout) confirms that runner resolved before that timeout
		expect(diff >= 750 && diff < defaultTimeout).to.equal(true, 'Runner resolved after timeout');
	});
});
