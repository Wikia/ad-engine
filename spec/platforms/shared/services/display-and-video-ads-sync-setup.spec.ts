import { expect } from 'chai';

import { context, InstantConfigService } from '@wikia/core';
import { DisplayAndVideoAdsSyncSetup } from '@wikia/platforms/shared';

describe('Display and video ads sync request setup', () => {
	const MOCKED_UAP_JWP_LINE_ITEM_ID = 666;
	const VAST_XML_MOCK = `<vast><Ad id="${MOCKED_UAP_JWP_LINE_ITEM_ID}"></Ad><Creative id="777"></Creative></vast>`;

	let orgFetch, fetchStub, orgDomParser, domParserStub, blobStub, instantConfigStub;

	beforeEach(() => {
		orgFetch = globalThis.fetch;
		orgDomParser = globalThis.DOMParser;

		blobStub = global.sandbox.stub();
		fetchStub = global.sandbox.stub();
		domParserStub = global.sandbox.stub();

		globalThis.fetch = fetchStub;
		globalThis.DOMParser = domParserStub;

		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);

		context.set('vast.adUnitId', '/5441/fake-vast-ad-unit');
	});

	afterEach(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('vast.adUnitId');
		context.remove('options.video.uapJWPLineItemIds');
		context.remove('options.video.vastXml');

		global.sandbox.restore();
		globalThis.fetch = orgFetch;
		globalThis.DOMParser = orgDomParser;
	});

	it('call resolves with null when disabled', async () => {
		instantConfigStub.get.withArgs('icDisplayAndVideoAdsSyncEnabled').returns(false);

		const displayAndVideoAdsSyncSetup = getDisplayAndVideoAdsSyncSetup();
		await displayAndVideoAdsSyncSetup.call();

		const initialized = await displayAndVideoAdsSyncSetup.initialized;
		expect(initialized).to.be.eq(null);
	});

	it('call resolves with null when not a page with a featured video', async () => {
		instantConfigStub.get.withArgs('icDisplayAndVideoAdsSyncEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', false);

		const displayAndVideoAdsSyncSetup = getDisplayAndVideoAdsSyncSetup();
		await displayAndVideoAdsSyncSetup.call();

		const initialized = await displayAndVideoAdsSyncSetup.initialized;
		expect(initialized).to.be.eq(null);
	});

	it('call resolves with null when fetch fails', async () => {
		instantConfigStub.get.withArgs('icDisplayAndVideoAdsSyncEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', true);
		fetchStub.resolves({
			status: 400,
		});

		const displayAndVideoAdsSyncSetup = getDisplayAndVideoAdsSyncSetup();
		await displayAndVideoAdsSyncSetup.call();

		const initialized = await displayAndVideoAdsSyncSetup.initialized;
		expect(initialized).to.be.eq(null);
	});

	it('call resolves with null when fetch() succeed but with no XML', async () => {
		instantConfigStub.get.withArgs('icDisplayAndVideoAdsSyncEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', true);
		context.set('options.video.uapJWPLineItemIds', []);
		blobStub.resolves({
			text: () => 'not-really-xml',
		});
		fetchStub.resolves({
			status: 200,
			blob: blobStub,
		});

		const displayAndVideoAdsSyncSetup = getDisplayAndVideoAdsSyncSetup();
		await displayAndVideoAdsSyncSetup.call();

		const initialized = await displayAndVideoAdsSyncSetup.initialized;
		expect(initialized).to.be.eq(null);
	});

	it('call resolves with null when there are no UAP:JWP campaigns defined', async () => {
		instantConfigStub.get.withArgs('icDisplayAndVideoAdsSyncEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', true);
		context.set('options.video.uapJWPLineItemIds', []);
		blobStub.resolves({
			text: () => '<vast><Ad id="666"></Ad><Creative id="777"></Creative></vast>',
		});
		fetchStub.resolves({
			status: 200,
			blob: blobStub,
		});

		const displayAndVideoAdsSyncSetup = getDisplayAndVideoAdsSyncSetup();
		await displayAndVideoAdsSyncSetup.call();

		const initialized = await displayAndVideoAdsSyncSetup.initialized;
		expect(initialized).to.be.eq(null);
	});

	it('call resolves with line-item ID when UAP:JWP campaign is served', async () => {
		instantConfigStub.get.withArgs('icDisplayAndVideoAdsSyncEnabled').returns(true);
		context.set('custom.hasFeaturedVideo', true);
		context.set('options.video.uapJWPLineItemIds', [MOCKED_UAP_JWP_LINE_ITEM_ID]);
		blobStub.resolves({
			text: () => VAST_XML_MOCK,
		});
		fetchStub.resolves({
			status: 200,
			blob: blobStub,
		});
		const documentMock = {
			getElementsByTagName: () => [
				{
					id: MOCKED_UAP_JWP_LINE_ITEM_ID,
				},
			],
		};
		const domParserInstanceMock = {
			parseFromString: () => documentMock,
		};
		domParserStub.returns(domParserInstanceMock);

		const displayAndVideoAdsSyncSetup = getDisplayAndVideoAdsSyncSetup();
		await displayAndVideoAdsSyncSetup.call();

		const initialized = await displayAndVideoAdsSyncSetup.initialized;
		expect(initialized).to.be.eq(MOCKED_UAP_JWP_LINE_ITEM_ID);
	});

	function getDisplayAndVideoAdsSyncSetup() {
		// @ts-ignore DisplayAndVideoAdsSyncSetup extends BaseServiceSetup which requires 2 arguments in the constructor
		return new DisplayAndVideoAdsSyncSetup(instantConfigStub, null);
	}
});
