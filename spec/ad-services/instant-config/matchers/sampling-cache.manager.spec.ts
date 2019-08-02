import { geoCacheStorage } from '@wikia/ad-engine/services/geo-cache-storage';
import { SamplingCacheManager } from '@wikia/ad-services/instant-config/matchers/sampling-cache.manager';
import { expect } from 'chai';
import { createSandbox, SinonExpectation, SinonStub } from 'sinon';

describe('Sampling Cache Manager', () => {
	const sandbox = createSandbox();
	const manager = new SamplingCacheManager();
	let randomStub: SinonStub;
	let storageSetStub: SinonStub;
	let storageGetStub: SinonStub;
	let predicate: SinonExpectation;

	beforeEach(() => {
		randomStub = sandbox.stub(Math, 'random');
		storageGetStub = sandbox.stub(geoCacheStorage, 'get');
		storageSetStub = sandbox.stub(geoCacheStorage, 'set');
		predicate = sandbox.mock();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should return value from storage', () => {
		storageGetStub.returns({ result: 'from storage' });

		expect(manager.apply('testId', {}, predicate)).to.equal('from storage');
		expect(storageGetStub.getCalls().length).to.equal(1);
		expect(storageGetStub.getCalls()[0].args[0]).to.equal('testId');
		expect(predicate.getCalls().length).to.equal(0);
	});

	it('should return value if no sampling', () => {
		predicate.returns('from predicate');

		expect(manager.apply('testId', {}, predicate)).to.equal('from predicate');
		expect(storageSetStub.getCalls().length).to.equal(0);
	});

	it('should not sample if value is false', () => {
		predicate.returns(false);

		expect(manager.apply('testId', {}, predicate)).to.equal(false);
		expect(storageSetStub.getCalls().length).to.equal(0);
	});

	describe('sampling', () => {
		beforeEach(() => {
			predicate.returns(true);
		});

		it('should pass', () => {
			randomStub.returns(0.7);

			expect(manager.apply('testId', { sampling: 80 }, predicate)).to.equal(true);
			expect(storageSetStub.getCalls().length).to.equal(1);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: true,
				withCookie: false,
				group: 'B',
				limit: 80,
			});
		});

		it('should fail', () => {
			randomStub.returns(0.7);

			expect(manager.apply('testId', { sampling: 60 }, predicate)).to.equal(false);
			expect(storageSetStub.getCalls().length).to.equal(1);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: false,
				withCookie: false,
				group: 'A',
				limit: 40,
			});
		});

		it('should pass with cache', () => {
			randomStub.returns(0.7);

			expect(manager.apply('testId', { sampling: 80, samplingCache: true }, predicate)).to.equal(
				true,
			);
			expect(storageSetStub.getCalls().length).to.equal(1);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: true,
				withCookie: true,
				group: 'B',
				limit: 80,
			});
		});

		it('should fail with cache', () => {
			randomStub.returns(0.7);

			expect(manager.apply('testId', { sampling: 60, samplingCache: true }, predicate)).to.equal(
				false,
			);
			expect(storageSetStub.getCalls().length).to.equal(1);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: false,
				withCookie: true,
				group: 'A',
				limit: 40,
			});
		});
	});

	describe('small values (to 0.000001 precision)', () => {
		beforeEach(() => {
			predicate.returns(true);
		});

		it('should work for pass', () => {
			randomStub.returns(0.000000001);

			expect(manager.apply('testId', { sampling: 0.000001 }, predicate)).to.equal(true);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: true,
				withCookie: false,
				group: 'B',
				limit: 0.000001,
			});
		});

		it('should work for fail', () => {
			randomStub.returns(0.3);

			expect(manager.apply('testId', { sampling: 0.000001 }, predicate)).to.equal(false);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: false,
				withCookie: false,
				group: 'A',
				limit: 99.999999,
			});
		});
	});

	describe('JS floating point discrepancy', () => {
		beforeEach(() => {
			predicate.returns(true);
		});

		it('should work for pass', () => {
			randomStub.returns(0.56876436787446);

			expect(manager.apply('testId', { sampling: 99.9 }, predicate)).to.equal(true);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: true,
				withCookie: false,
				group: 'B',
				limit: 99.9,
			});
		});

		it('should work for fail', () => {
			randomStub.returns(0.9990001);

			expect(manager.apply('testId', { sampling: 99.9 }, predicate)).to.equal(false);
			expect(storageSetStub.getCalls()[0].args[0]).to.deep.equal({
				name: 'testId',
				result: false,
				withCookie: false,
				group: 'A',
				limit: 0.1,
			});
		});
	});
});
