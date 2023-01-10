import { expect } from 'chai';
import sinon from 'sinon';

import { BabDetection } from '@wikia/core';
import { WadRunner } from '@wikia/platforms/shared';

function createDetectionRunStub(returnValue: boolean) {
	return new Promise<void>((resolve) => {
		resolve();
	}).then(() => {
		return returnValue;
	});
}

describe('Wikia AdBlock Detector runner', () => {
	const babDetectionStub = sinon.createStubInstance(BabDetection);
	const onDetected = sinon.spy();
	let wadRunner: WadRunner;

	beforeEach(() => {
		wadRunner = new WadRunner();
		wadRunner.detector = babDetectionStub;
		wadRunner.onDetected = onDetected;
	});

	it('does not call onDetect callback when ad detection is disabled', async () => {
		babDetectionStub.isEnabled.returns(false);

		await wadRunner.call();

		expect(onDetected.called).to.equal(false);
	});

	it('does not call onDetect callback when ad blocking is not detected', async () => {
		const babDetectionRunStub = createDetectionRunStub(false);
		babDetectionStub.isEnabled.returns(true);
		babDetectionStub.run.returns(babDetectionRunStub);

		await wadRunner.call();

		expect(onDetected.called).to.equal(false);
	});

	it('does call onDetect callback when ad blocking is detected', async () => {
		const babDetectionRunStub = createDetectionRunStub(true);
		babDetectionStub.isEnabled.returns(true);
		babDetectionStub.run.returns(babDetectionRunStub);

		await wadRunner.call();

		expect(onDetected.called).to.equal(true);
	});
});
