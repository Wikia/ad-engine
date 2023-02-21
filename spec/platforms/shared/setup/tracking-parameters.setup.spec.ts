import { TrackingParametersSetup } from '@wikia/platforms/shared';
import Cookies from 'js-cookie';
import Sinon, { assert } from 'sinon';

describe('TrackingParametersSetup', () => {
	let sandbox: sinon.SinonSandbox;
	let cookiesGetStub: sinon.SinonStub;

	beforeEach(() => {
		sandbox = Sinon.createSandbox();
		cookiesGetStub = sandbox.stub(Cookies, 'get');
	});

	afterEach(() => {
		sandbox.restore();
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
