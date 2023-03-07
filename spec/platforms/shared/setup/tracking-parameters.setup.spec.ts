import { WaitFor } from '@wikia/core/utils';
import { TrackingParametersSetup } from '@wikia/platforms/shared';
import Cookies from 'js-cookie';
import sinon, { assert } from 'sinon';

describe('TrackingParametersSetup', () => {
	let cookiesGetStub: sinon.SinonStub;

	beforeEach(() => {
		cookiesGetStub = global.sandbox.stub(Cookies, 'get');
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
	});

	afterEach(() => {
		global.sandbox.restore();
	});

	it('should set legacy context when flag is set to false', () => {
		const instantConfig = {
			get: () => false,
		} as any;
		const experimentSetup = new TrackingParametersSetup(instantConfig);

		experimentSetup.execute();

		assert.called(cookiesGetStub);
	});

	it('should set new context when flag is set to true', () => {
		const instantConfig = {
			get: () => true,
		} as any;
		const experimentSetup = new TrackingParametersSetup(instantConfig);

		experimentSetup.execute();

		assert.notCalled(cookiesGetStub);
	});
});
