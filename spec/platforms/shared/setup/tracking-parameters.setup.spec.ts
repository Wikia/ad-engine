// @ts-strict-ignore
import { context } from '@wikia/core';
import { WaitFor } from '@wikia/core/utils';
import { TrackingParametersSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';

describe('TrackingParametersSetup', () => {
	beforeEach(() => {
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
		// @ts-expect-error not all properties are defined here
		window.fandomContext = {
			tracking: {
				pvUID: 'some-pv-uuid',
			},
		};
	});

	afterEach(() => {
		delete window.fandomContext;
		global.sandbox.restore();
	});

	it('should set tracking context', async () => {
		// given
		const instantConfig = {
			get: () => true,
		} as any;
		const experimentSetup = new TrackingParametersSetup(instantConfig);

		// when
		await experimentSetup.execute();

		// then
		expect(context.get('wiki.pvUID')).to.equal('some-pv-uuid');
	});
});
