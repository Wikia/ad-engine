import { expect } from 'chai';
import { context } from '../../../src/ad-engine/index';
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
		delete window.localStorage;
		delete window.kruxDartParam_foo;
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
		window.localStorage.kxwikia_segs = 'abc,bar,zxc';

		krux.importUserData();

		expect(krux.getSegments()[0]).to.equal('abc');
		expect(krux.getSegments()[1]).to.equal('bar');
		expect(krux.getSegments()[2]).to.equal('zxc');
	});

	it('export context targeting to krux', () => {
		krux.exportPageParams();

		expect(window.kruxDartParam_foo).to.equal('bar');
	});
});
