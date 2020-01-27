// tslint:disable:tsl-ban-snippets
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, localCache } from '../../../src/ad-engine';
import { krux } from '../../../src/ad-services/krux';

describe('Krux service', () => {
	let globalKruxMock = null;
	const sandbox = createSandbox();

	beforeEach(() => {
		(window as any).localStorage = {};

		context.set('services.krux', {
			account: 'ns:foo',
			enabled: true,
			id: 'foo',
		});
		context.set('targeting.foo', 'bar');
		context.set('targeting.kuid', null);
		context.set('targeting.ksg', null);

		globalKruxMock = sandbox.stub(window, 'Krux');
	});

	afterEach(() => {
		sandbox.restore();
		// @ts-ignore
		delete window.kruxDartParam_foo;
		delete (window as any).localStorage;
	});

	describe('local storage available', () => {
		beforeEach(() => {
			sandbox.stub(localCache, 'isAvailable').returns(true);
		});

		it('import user data and return user id from old key name', () => {
			window.localStorage.kxuser = 'foo';

			krux.importUserData();

			expect(krux.getUserId()).to.equal('foo');
		});

		it('import user data and return user id from old key name', () => {
			window.localStorage.kxwikia_user = 'foo';

			krux.importUserData();

			expect(krux.getUserId()).to.equal('foo');
		});

		it('import user data and return segments for old key name', () => {
			window.localStorage.kxsegs = 'abc,bar,zxc';

			krux.importUserData();

			expect(krux.getSegments()[0]).to.equal('abc');
			expect(krux.getSegments()[1]).to.equal('bar');
			expect(krux.getSegments()[2]).to.equal('zxc');
		});

		it('import user data and return segments for old key name', () => {
			window.localStorage.kxsegs = 'abc,bar,zxc';

			krux.importUserData();

			expect(krux.getSegments()[0]).to.equal('abc');
			expect(krux.getSegments()[1]).to.equal('bar');
			expect(krux.getSegments()[2]).to.equal('zxc');
		});

		it('export context targeting to krux', () => {
			krux.exportPageParams();

			// @ts-ignore
			expect(window.kruxDartParam_foo).to.equal('bar');
		});
	});

	describe('local storage not available', () => {
		beforeEach(() => {
			sandbox.stub(localCache, 'isAvailable').returns(false);
		});

		it('import user data failes when there is no local storage', () => {
			window.localStorage.kxuser = 'foo';

			krux.importUserData();

			expect(krux.getUserId()).to.equal(null);
		});
	});

	describe('event dispatching', () => {
		it('fires krux admEvent', () => {
			krux.fireEvent('foo');

			expect(globalKruxMock.calledOnce).to.be.true;
			expect(
				globalKruxMock.calledWith('ns:foo', 'admEvent', 'foo', {
					event_type: 'default',
				}),
			).to.be.true;
		});
	});
});
