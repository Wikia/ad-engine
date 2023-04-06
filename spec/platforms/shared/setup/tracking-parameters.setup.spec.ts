import { WaitFor } from '@wikia/core/utils';
import { TrackingParametersSetupExecutable } from '@wikia/platforms/shared';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('TrackingParametersSetup', () => {
	beforeEach(() => {
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
	});

	afterEach(() => {
		global.sandbox.restore();
	});

	it('should always set tracking context', async () => {
		const fandomContextMock = {
			tracking: {
				beaconId: 'beaconId',
				pvNumber: 'pvNumber',
				pvNumberGlobal: 'pvNumberGlobal',
				sessionId: 'sessionId',
				pvUID: 'pvUID',
			},
		} as any;
		const contextMock = {
			set: sinon.spy(),
			get: () => ({ wikiParam: 'hello' }),
		} as any;
		const trackingParametersSetup = new TrackingParametersSetupExecutable(
			fandomContextMock,
			contextMock,
		);
		await trackingParametersSetup.execute();

		expect(
			contextMock.set.calledWith('wiki', {
				...fandomContextMock.tracking,
				wikiParam: 'hello',
			}),
		).to.be.true;
	});
});
