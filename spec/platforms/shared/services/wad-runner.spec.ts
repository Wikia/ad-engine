import { expect } from 'chai';
import sinon from 'sinon';

import { BabDetection } from '../../../../src/core/services/bab-detection';
import { WadRunner } from '../../../../src/platforms/shared/services/wad-runner';

describe('Wikia AdBlock Detector runner', () => {
	const babDetectionStub = sinon.createStubInstance(BabDetection);
	const onDetected = sinon.spy();

	it('does not call onDetect callback when ad detection is disabled', async () => {
		babDetectionStub.isEnabled.returns(false);

		const wadRunner = new WadRunner(babDetectionStub, onDetected);
		await wadRunner.call();

		expect(onDetected.called).to.equal(false);
	});

	it('does not call onDetect callback when ad blocking is not detected', async () => {
		const babDetectionRunStub = createDetectionRunStub(false);
		babDetectionStub.isEnabled.returns(true);
		babDetectionStub.run.returns(babDetectionRunStub);

		const wadRunner = new WadRunner(babDetectionStub, onDetected);
		await wadRunner.call();

		expect(onDetected.called).to.equal(false);
	});

	it('does call onDetect callback when ad blocking is detected', async () => {
		const babDetectionRunStub = createDetectionRunStub(true);
		babDetectionStub.isEnabled.returns(true);
		babDetectionStub.run.returns(babDetectionRunStub);

		const wadRunner = new WadRunner(babDetectionStub, onDetected);
		await wadRunner.call();

		expect(onDetected.called).to.equal(true);
	});

	function createDetectionRunStub(returnValue: boolean) {
		return new Promise((resolve) => {
			resolve();
		}).then(() => {
			return returnValue;
		});
	}
});
