import { utils } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('WaitFor', () => {
	const sandbox = createSandbox();
	let counter;

	beforeEach(() => {
		counter = 0;
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('when condition is met withing the specified time returns true', async () => {
		const obj = {
			waitingCondition: () => {
				counter++;
				return counter === 2;
			},
		};
		const waitingConditionSpy = sandbox.spy(obj, 'waitingCondition');

		const promise = await new utils.WaitFor(obj.waitingCondition, 3, 10).until();
		expect(promise).to.equal(true);
		expect(waitingConditionSpy.callCount).to.equal(2);
	});

	it('when condition is not met withing the specified time returns false', async () => {
		const obj = {
			waitingCondition: () => {
				counter++;
				return counter === 5;
			},
		};
		const waitingConditionSpy = sandbox.spy(obj, 'waitingCondition');

		const promise = await new utils.WaitFor(obj.waitingCondition, 2, 10).until();
		expect(promise).to.equal(false);
		expect(waitingConditionSpy.callCount).to.equal(3);
	});
});
