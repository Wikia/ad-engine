import { utils } from '@wikia/ad-engine';
import { expect } from 'chai';

describe('WaitFor', () => {
	it('when condition is met withing the specified time returns true', async () => {
		const windowObj = {
			obj1: 'null',
		};

		setTimeout(() => {
			windowObj.obj1 = 'something';
		}, 10);

		const conditionToWaitFor = () => windowObj.obj1 === 'something';

		const promise = await new utils.WaitFor(conditionToWaitFor, 3, 10).until();
		expect(promise).to.equal(true);
	});

	it('when condition is met withing the specified time returns false', async () => {
		const windowObj = {
			obj1: 'null',
		};

		setTimeout(() => {
			windowObj.obj1 = 'something';
		}, 80);

		const conditionToWaitFor = () => windowObj.obj1 === 'something';

		const promise = await new utils.WaitFor(conditionToWaitFor, 3, 10).until();
		expect(promise).to.equal(false);
	});
});
