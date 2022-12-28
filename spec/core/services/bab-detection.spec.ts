import { expect } from 'chai';
import sinon from 'sinon';

import { BabDetection } from '../../../src/core/services/bab-detection';

describe('AdBlock detector', () => {
	const blockAdBlockStub = {
		onDetected: () => {},
		onNotDetected: () => {},
		check: () => {},
	};

	afterEach(() => {
		blockAdBlockStub.onNotDetected = () => {};
		blockAdBlockStub.onDetected = () => {};
	});

	it('returns true when there is no BlockAdBlock', async () => {
		const detector = new BabDetection();

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	it('returns false when there is no ad block', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'doesBlockAdBlockExist').returns(true);
		makeBlockAdBlockStubNotDetectAdBlock();
		createCreateBlockAdBlockStub(detector);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(false));

		return await detector.run().then((detected) => {
			expect(detected).to.be.false;
		});
	});

	it('returns true when there is ad block found by BlockAdBlock', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'doesBlockAdBlockExist').returns(true);
		makeBlockAdBlockStubDetectAdBlock();
		createCreateBlockAdBlockStub(detector);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(false));

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	it('returns true when there is ad block not found by BlockAdBlock but found by domain block check', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'doesBlockAdBlockExist').returns(true);
		makeBlockAdBlockStubNotDetectAdBlock();
		createCreateBlockAdBlockStub(detector);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(true));

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	it('returns true when there is ad block found by BlockAdBlock and found by domain block check', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'doesBlockAdBlockExist').returns(true);
		makeBlockAdBlockStubDetectAdBlock();
		createCreateBlockAdBlockStub(detector);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(true));

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	function createCreateBlockAdBlockStub(detector) {
		// @ts-ignore just for tests
		sinon.stub(detector, 'createBlockAdBlock').returns(blockAdBlockStub);
	}

	function createCheckDomainBlockingStub(returnValue: boolean) {
		return new Promise((resolve) => {
			resolve();
		}).then(() => {
			return returnValue;
		});
	}

	function makeBlockAdBlockStubDetectAdBlock() {
		// @ts-ignore just for tests
		blockAdBlockStub.onDetected = (cb) => cb();
	}

	function makeBlockAdBlockStubNotDetectAdBlock() {
		// @ts-ignore just for tests
		blockAdBlockStub.onNotDetected = (cb) => cb();
	}
});
