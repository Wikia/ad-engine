import {
	CacheData,
	InstantConfigCacheStorage,
} from '@wikia/ad-engine/services/instant-config-cache-storage';
import { SessionCookie } from '@wikia/ad-engine/services/session-cookie';
import { expect } from 'chai';
import { createSandbox, SinonSpy, SinonStub } from 'sinon';

describe('Instant Config Cache Storage', () => {
	const sandbox = createSandbox();
	const cacheStorage = InstantConfigCacheStorage.make();
	let getItemStub: SinonStub;
	let setItemStub: SinonStub;
	let readSessionIdSpy: SinonSpy;

	beforeEach(() => {
		getItemStub = sandbox.stub(SessionCookie.prototype, 'getItem');
		setItemStub = sandbox.stub(SessionCookie.prototype, 'setItem');
		readSessionIdSpy = sandbox.spy(SessionCookie.prototype, 'readSessionId');

		cacheStorage.resetCache();
		readSessionIdSpy.resetHistory();
		getItemStub.resetHistory();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('resetCache', () => {
		it('should read from storage', () => {
			expect(getItemStub.getCalls().length).to.equal(0);

			cacheStorage.resetCache();

			expect(getItemStub.getCalls().length).to.equal(1);
			expect(getItemStub.getCalls()[0].args[0]).to.equal('basset');
		});
	});

	describe('get', () => {
		it('should return undefined', () => {
			expect(cacheStorage.get('not defined')).to.equal(undefined);
		});

		it('should return value', () => {
			getItemStub.returns({ testId: { name: 'testId', result: true } });
			cacheStorage.resetCache();
			expect(cacheStorage.get('testId')).to.deep.equal({
				name: 'testId',
				result: true,
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
		const cookieData: CacheData = {
			...cacheData,
			withCookie: true,
		};

		it('should save data only to cache', () => {
			cacheStorage.set(cacheData);

			expect(cacheStorage.get('testId')).to.equal(cacheData);
			expect(setItemStub.getCalls().length).to.equal(0);
		});

		it('should save data to cache and cookie', () => {
			cacheStorage.set(cookieData);

			expect(cacheStorage.get('testId')).to.equal(cookieData);
			expect(setItemStub.getCalls().length).to.equal(1);
			expect(setItemStub.getCalls()[0].args[0]).to.equal('basset');
			expect(setItemStub.getCalls()[0].args[1]).to.deep.equal({ testId: cookieData });
		});

		it('should save some to cache and some to cache and cookie', () => {
			cacheStorage.set({ ...cookieData, name: 'test1' });
			expect(setItemStub.getCalls().length).to.equal(1);
			expect(setItemStub.getCalls()[0].args[1]).to.deep.equal({
				test1: { ...cookieData, name: 'test1' },
			});

			cacheStorage.set({ ...cacheData, name: 'test2' });
			expect(setItemStub.getCalls().length).to.equal(1);

			cacheStorage.set({ ...cookieData, name: 'test2' });
			expect(setItemStub.getCalls().length).to.equal(2);
			expect(setItemStub.getCalls()[1].args[1]).to.deep.equal({
				test1: { ...cookieData, name: 'test1' },
				test2: { ...cookieData, name: 'test2' },
			});
		});
	});

	describe('getSamplingResults', () => {
		it('should return empty array', () => {
			expect(cacheStorage.getSamplingResults()).to.deep.equal([]);
		});

		it('should return array', () => {
			getItemStub.returns({
				first: {
					name: 'first-1',
					limit: 45,
					group: 'B',
				},
				second: {
					name: 'second-2',
					limit: 90.09,
					group: 'A',
				},
				third: {
					name: 'third',
					limit: 10,
					group: 'A',
				},
			});
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

			sandbox.stub(cacheStorage, 'getSamplingResults').returns(['FOO_A_1', 'BAR_B_99']);
			expect(cacheStorage.mapSamplingResults(wfKeyVals)).to.deep.equal(['foo_a', 'bar_b']);
		});
	});
});
