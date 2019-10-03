import { expect } from 'chai';
import * as sinon from 'sinon';
import { AdSlot, context, InstantConfigCacheStorage } from '../../src/ad-engine';
import { AdInfoContext, slotTrackingMiddleware } from '../../src/ad-tracking';

describe('slot-tracking-middleware', () => {
	const sandbox = sinon.createSandbox();
	let adSlot: AdSlot;
	let nextSpy: sinon.SinonSpy;
	let adInfoContext: AdInfoContext;

	beforeEach(() => {
		sandbox.stub(window, 'performance').value({
			timing: {
				connectStart: 250,
			},
		});
		sandbox
			.stub(InstantConfigCacheStorage.prototype, 'getSamplingResults')
			.returns(['FOO_A_1', 'BAR_B_99']);
		sandbox.stub(document, 'hidden').get(() => undefined);
		window.pvNumber = 5;

		context.set('targeting', {
			esrb: 'kids',
			lang: 'de',
			likho: ['a', 'b'],
			ref: 'search',
			s0: 'life',
			s0v: 'lifestyle',
			s1: '_project43',
			s2: 'article',
			skin: 'oasis',
			top: '1k',
		});

		context.set('geo.country', 'PL');

		adSlot = new AdSlot({ id: 'foo' });
	});

	beforeEach(() => {
		adInfoContext = {
			data: {
				previous: 'value',
			},
			slot: adSlot,
		};

		nextSpy = sinon.spy();
	});

	afterEach(() => {
		sandbox.restore();
		delete window['pvNumber'];
	});

	it('returns all general keys for tracking', () => {
		slotTrackingMiddleware(adInfoContext, nextSpy);

		expect(Object.keys(nextSpy.getCall(0).args[0].data)).to.deep.equal([
			'previous',
			'timestamp',
			'browser',
			'country',
			'device',
			'document_visibility',
			'is_uap',
			'key_vals',
			'kv_ah',
			'kv_esrb',
			'kv_lang',
			'kv_ref',
			'kv_s0',
			'kv_s0v',
			'kv_s1',
			'kv_s2',
			'kv_skin',
			'kv_top',
			'labrador',
			'opt_in',
			'page_layout',
			'page_width',
			'pv',
			'pv_unique_id',
			'scroll_y',
			'time_bucket',
			'tz_offset',
			'viewport_height',
		]);
	});

	it('returns general info for tracking', () => {
		slotTrackingMiddleware(adInfoContext, nextSpy);

		const { data } = nextSpy.getCall(0).args[0];

		expect(data['previous']).to.equal('value');
		expect(data['country']).to.equal('PL');
		expect(data['device']).to.equal('desktop');
		expect(data['document_visibility']).to.equal('not_implemented');
		expect(data['key_vals']).to.equal('likho=a|b');
		expect(data['kv_ah']).to.equal(0);
		expect(data['kv_esrb']).to.equal('kids');
		expect(data['kv_lang']).to.equal('de');
		expect(data['kv_ref']).to.equal('search');
		expect(data['kv_s0']).to.equal('life');
		expect(data['kv_s0v']).to.equal('lifestyle');
		expect(data['kv_s1']).to.equal('_project43');
		expect(data['kv_s2']).to.equal('article');
		expect(data['kv_skin']).to.equal('oasis');
		expect(data['kv_top']).to.equal('1k');
		expect(data['labrador']).to.equal('FOO_A_1;BAR_B_99');
		expect(data['opt_in']).to.equal('');
		expect(data['page_layout']).to.equal('pos_top=null');
		expect(data['pv']).to.equal(5);
		expect(data['scroll_y']).to.equal(0);
	});

	it('returns rounded pos_top in page_layout field', () => {
		const stub = sinon.stub(adSlot, 'getTopOffset').callsFake(() => 20.111);

		slotTrackingMiddleware(adInfoContext, nextSpy);

		const { data } = nextSpy.getCall(0).args[0];

		expect(data['page_layout']).to.equal('pos_top=20');

		stub.reset();
	});
});
