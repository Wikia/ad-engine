import { CacheData, InstantConfigCacheStorage, UniversalStorage } from '@wikia/core';
import { expect } from 'chai';
import { SinonStub } from 'sinon';

describe('Instant Config Cache Storage', () => {
	const cacheStorage = InstantConfigCacheStorage.make();
	let getItemStub: SinonStub;
	let setItemStub: SinonStub;

	beforeEach(() => {
		getItemStub = global.sandbox.stub(UniversalStorage.prototype, 'getItem');
		setItemStub = global.sandbox.stub(UniversalStorage.prototype, 'setItem');

		cacheStorage.resetCache();
		getItemStub.resetHistory();
	});

	describe('get', () => {
		it('should return undefined', () => {
			expect(cacheStorage.get('not defined')).to.equal(undefined);
		});

		it('should return value from cookie', () => {
			getItemStub.returns('testId_A_11:true');
			cacheStorage.resetCache();
			expect(cacheStorage.get('testId')).to.deep.equal({
				group: 'A',
				limit: 11,
				name: 'testId',
				result: true,
				withCookie: true,
			});
		});
	});

	describe('set', () => {
		const cacheData: CacheData = {
			name: 'testId',
			group: 'B',
			limit: 30,
			result: true,
			withCookie: false,
		};

		it('should save data to cache', () => {
			cacheStorage.set(cacheData);

			expect(cacheStorage.get('testId')).to.equal(cacheData);
			expect(setItemStub.getCalls().length).to.equal(0);
		});
	});

	describe('getSamplingResults', () => {
		it('should return empty array', () => {
			expect(cacheStorage.getSamplingResults()).to.deep.equal([]);
		});

		it('should return array', () => {
			getItemStub.returns('first_B_45:true|second_A_90.09:true|third_A_10:true');
			cacheStorage.resetCache();

			expect(cacheStorage.getSamplingResults()).to.deep.equal([
				'first_B_45',
				'second_A_90.09',
				'third_A_10',
			]);
		});
	});

	describe('mapSamplingResults', () => {
		it('should return empty array', () => {
			expect(cacheStorage.mapSamplingResults()).to.deep.equal([]);
			expect(cacheStorage.mapSamplingResults([])).to.deep.equal([]);
		});

		it('should select dfp labrador key-vals', () => {
			const wfKeyVals = [
				'FOO_A_1:foo_a',
				'FOO_B_99:foo_b',
				'BAR_A_1:bar_a',
				'BAR_B_99:bar_b',
				'OOZ_A_1:ooz_a',
				'OOZ_B_99:ooz_b',
			];

			global.sandbox.stub(cacheStorage, 'getSamplingResults').returns(['FOO_A_1', 'BAR_B_99']);
			expect(cacheStorage.mapSamplingResults(wfKeyVals)).to.deep.equal(['foo_a', 'bar_b']);
		});
	});
});
