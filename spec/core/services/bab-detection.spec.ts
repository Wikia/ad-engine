import { expect } from 'chai';
import sinon from 'sinon';

import { BabDetection } from '@wikia/core';

function createCreateBlockAdBlockStub(detector, createBlockAdBlockStub) {
	return sinon.stub(detector, 'createBlockAdBlock').returns(createBlockAdBlockStub);
}

function createCheckDomainBlockingStub(returnValue: boolean) {
	return new Promise((resolve) => {
		resolve();
	}).then(() => {
		return returnValue;
	});
}

function makeBlockAdBlockStubDetectAdBlock(blockAdBlockStub) {
	// @ts-ignore just for tests
	blockAdBlockStub.onDetected = (cb) => cb();
}

function makeBlockAdBlockStubNotDetectAdBlock(blockAdBlockStub) {
	// @ts-ignore just for tests
	blockAdBlockStub.onNotDetected = (cb) => cb();
}

describe('AdBlock detector', () => {
	const createBlockAdBlockStub = {
		onDetected: () => {},
		onNotDetected: () => {},
		check: () => {},
	};

	afterEach(() => {
		createBlockAdBlockStub.onNotDetected = () => {};
		createBlockAdBlockStub.onDetected = () => {};
	});

	it('returns true when there is no BlockAdBlock', async () => {
		const detector = new BabDetection();

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	it('returns false when there is no ad block', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'blockAdBlockExists').returns(true);
		makeBlockAdBlockStubNotDetectAdBlock(createBlockAdBlockStub);
		createCreateBlockAdBlockStub(detector, createBlockAdBlockStub);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(false));

		return await detector.run().then((detected) => {
			expect(detected).to.be.false;
		});
	});

	it('returns true when there is ad block found by BlockAdBlock', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'blockAdBlockExists').returns(true);
		makeBlockAdBlockStubDetectAdBlock(createBlockAdBlockStub);
		createCreateBlockAdBlockStub(detector, createBlockAdBlockStub);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(false));

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	it('returns true when there is ad block not found by BlockAdBlock but found by domain block check', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'blockAdBlockExists').returns(true);
		makeBlockAdBlockStubNotDetectAdBlock(createBlockAdBlockStub);
		createCreateBlockAdBlockStub(detector, createBlockAdBlockStub);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(true));

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});

	it('returns true when there is ad block found by BlockAdBlock and found by domain block check', async () => {
		const detector = new BabDetection();

		sinon.stub(detector, 'blockAdBlockExists').returns(true);
		makeBlockAdBlockStubDetectAdBlock(createBlockAdBlockStub);
		createCreateBlockAdBlockStub(detector, createBlockAdBlockStub);
		sinon.stub(detector, 'checkDomainBlocking').returns(createCheckDomainBlockingStub(true));

		return await detector.run().then((detected) => {
			expect(detected).to.be.true;
		});
	});
});
