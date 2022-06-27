import { PrebidNativeProvider } from '@wikia/ad-bidders';
import { createSandbox } from 'sinon';
import { context } from '@wikia/ad-engine';
import { expect } from 'chai';

describe('Prebid native provider', () => {
	const sandbox = createSandbox();
	const prebidNativeProvider = new PrebidNativeProvider();
	let contextStub;

	beforeEach(() => {
		contextStub = sandbox.stub(context);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Prebid native provider is disabled by feature flag', () => {
		contextStub.get.withArgs('bidders.prebid.native.enabled').returns(false);

		expect(prebidNativeProvider.isEnabled()).to.be.false;
	});

	it('Generates ad from template', () => {
		const data = {
			adTemplate: `<div id="native-prebid-ad">
								<a href="##hb_native_linkurl##">
									<img src="##hb_native_image##">
								</a>
							<a href="##hb_native_linkurl##">
								<p>##hb_native_title##</p>
							</a>
							<p>##hb_native_body##</p>
							<a href="##hb_native_linkurl##">
								<button>##hb_native_displayUrl##</button>
							</a>
						</div>`,
			body: 'Test body',
			clickUrl: 'testurl.com',
			displayUrl: 'Read more',
			image: {
				url: 'image.url.com',
				height: 100,
				width: 100,
			},
			title: 'Test title',
		};

		const ad = prebidNativeProvider.replaceAssetPlaceholdersWithData(data.adTemplate, data);
		expect(ad).to.equal(`<div id="native-prebid-ad">
								<a href="testurl.com">
									<img src="image.url.com">
								</a>
							<a href="testurl.com">
								<p>Test title</p>
							</a>
							<p>Test body</p>
							<a href="testurl.com">
								<button>Read more</button>
							</a>
						</div>`);
	});
});
