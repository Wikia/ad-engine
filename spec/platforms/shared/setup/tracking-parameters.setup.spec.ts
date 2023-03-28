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

	it('should always set new context', () => {
		const experimentSetup = new TrackingParametersSetup();

		experimentSetup.execute();

		assert.notCalled(cookiesGetStub);
	});
});
