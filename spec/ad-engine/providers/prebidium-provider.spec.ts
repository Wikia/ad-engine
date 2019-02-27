import { context, PrebidiumProvider } from '@wikia/ad-engine';
import { assert } from 'chai';
import sinon from 'sinon';

describe('PrebidiumProvider', () => {
	let sandbox;
	let prebidiumProvider;
	const stub = {
		context: {
			get: undefined,
		},
		que: {
			push: undefined,
		},
		renderAd: undefined,
	};
	const mock = {
		doc: 'mock_document',
		adId: 'mock_ad_id',
		slotName: 'mock_slot_name',
	};

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		prebidiumProvider = new PrebidiumProvider();

		stubIframeBuilder();
		stub.context.get = sandbox.stub(context, 'get').returns(mock.adId);
		stubPbjs();
	});

	describe('fillIn', () => {
		let adSlot;

		beforeEach(() => {
			adSlot = {
				getSlotName: () => mock.slotName,
			};
			prebidiumProvider.fillIn(adSlot);
		});

		it('should call renderAd', () => {
			const [doc, adId] = stub.renderAd.getCall(0).args;

			assert(stub.renderAd.calledOnce);
			assert.equal(doc, mock.doc);
			assert.equal(adId, mock.adId);
		});

		it('should be postponed until pbjs loads', () => {
			assert(stub.que.push.calledOnce);
		});

		it('should call context get with correct argument', () => {
			const argument = stub.context.get.getCall(0).args[0];

			assert(stub.context.get.calledOnce);
			assert.equal(argument, `slots.${mock.slotName}.targeting.hb_adid`);
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	function stubIframeBuilder() {
		sandbox.stub(prebidiumProvider.iframeBuilder, 'create').returns({
			contentWindow: {
				document: mock.doc,
			},
		});
	}

	function stubPbjs() {
		window.pbjs = {
			renderAd: () => {},
			que: [],
		};
		stub.renderAd = sandbox.stub(window.pbjs, 'renderAd');
		stub.que.push = sandbox.stub(window.pbjs.que, 'push').callsFake((method) => method());
	}
});
