import { context, PrebidiumProvider } from '@wikia/ad-engine';
import { IframeBuilder } from '@wikia/ad-engine/utils';
import { assert } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';
import { PbjsStub, stubPbjs } from '../services/pbjs.stub';

describe('PrebidiumProvider', () => {
	let sandbox: SinonSandbox;
	let prebidiumProvider: PrebidiumProvider;
	const contextStub = {
		get: undefined,
	};
	let pbjsStub: PbjsStub;
	const mock = {
		doc: 'mock_document',
		adId: 'mock_ad_id',
		slotName: 'mock_slot_name',
	};

	beforeEach(() => {
		sandbox = createSandbox();
		prebidiumProvider = new PrebidiumProvider();

		stubIframeBuilder();
		contextStub.get = sandbox.stub(context, 'get').returns(mock.adId);
		pbjsStub = stubPbjs(sandbox).pbjsStub;
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('fillIn', () => {
		let adSlot;

		beforeEach(async () => {
			adSlot = {
				getSlotName: () => mock.slotName,
			};
			await prebidiumProvider.fillIn(adSlot);
		});

		it('should call renderAd', () => {
			const [doc, adId] = pbjsStub.renderAd.getCall(0).args;

			assert(pbjsStub.renderAd.calledOnce);
			assert.equal(doc, mock.doc);
			assert.equal(adId, mock.adId);
		});

		it('should call context get with correct argument', () => {
			const argument = contextStub.get.getCall(0).args[0];

			assert(contextStub.get.calledOnce);
			assert.equal(argument, `slots.${mock.slotName}.targeting.hb_adid`);
		});
	});

	function stubIframeBuilder(): void {
		sandbox.stub(IframeBuilder.prototype, 'create').returns({
			contentWindow: {
				document: mock.doc,
			},
		} as any);
	}
});
