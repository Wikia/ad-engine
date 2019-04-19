import { expect } from 'chai';
import * as sinon from 'sinon';
import { context, localCache } from '../../../src/ad-engine';
import { krux } from '../../../src/ad-services/krux';

describe('Krux service', () => {
	beforeEach(() => {
		window.localStorage = {};
		context.set('services.krux', {
			enabled: true,
			id: 'foo',
		});
		context.set('targeting.foo', 'bar');
		context.set('targeting.kuid', null);
		context.set('targeting.ksg', null);
	});

	afterEach(() => {
		localCache.isAvailable.restore();
		delete window.localStorage;
		delete window.kruxDartParam_foo;
	});

	describe('local storage available', () => {
		beforeEach(() => {
			sinon.stub(localCache, 'isAvailable').returns(true);
		});

		it('import user data and return user id from old key name', () => {
			const stub = sinon.stub(localCache, 'get').returns('foo');

			krux.importUserData();

			expect(krux.getUserId()).to.equal('foo');
			stub.restore();
		});

		it('import user data and return user id from old key name', () => {
			const stub = sinon.stub(localCache, 'get').returns('foo');

			krux.importUserData();

			expect(krux.getUserId()).to.equal('foo');
			stub.restore();
		});

		it('import user data and return segments for old key name', () => {
			const stub = sinon.stub(localCache, 'get').returns('abc,bar,zxc');

			krux.importUserData();

			expect(krux.getSegments()[0]).to.equal('abc');
			expect(krux.getSegments()[1]).to.equal('bar');
			expect(krux.getSegments()[2]).to.equal('zxc');
			stub.restore();
		});

		it('import user data and return segments for old key name', () => {
			const stub = sinon.stub(localCache, 'get').returns('abc,bar,zxc');

			krux.importUserData();

			expect(krux.getSegments()[0]).to.equal('abc');
			expect(krux.getSegments()[1]).to.equal('bar');
			expect(krux.getSegments()[2]).to.equal('zxc');
			stub.restore();
		});

		it('export context targeting to krux', () => {
			krux.exportPageParams();

			expect(window.kruxDartParam_foo).to.equal('bar');
		});
	});

	describe('local storage not available', () => {
		beforeEach(() => {
			sinon.stub(localCache, 'isAvailable').returns(false);
		});

		it('import user data failes when there is no local storage', () => {
			const stub = sinon.stub(localCache, 'get').returns('foo');

			krux.importUserData();

			expect(krux.getUserId()).to.equal(null);
			stub.restore();
		});
	});
});
