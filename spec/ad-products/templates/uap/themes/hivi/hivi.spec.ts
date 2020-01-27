import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import { context, slotTweaker } from '../../../../../../src/ad-engine';
import { resolvedState } from '../../../../../../src/ad-products/templates/uap/resolved-state';
import { BfaaHiviTheme } from '../../../../../../src/ad-products/templates/uap/themes/hivi';
import { AdSlotStub, createAdSlotStub } from '../../../../../ad-engine/models/ad-slot.stub';

function getSlotElement() {
	return {
		appendChild: () => {},
		classList: {
			contains: () => false,
			add: () => {},
		},
		style: {},
		offsetWidth: 1920,
	};
}

function getAdSlotObject(sandbox: SinonSandbox): AdSlotStub {
	const stub = createAdSlotStub(sandbox);

	stub.getElement.callsFake(getSlotElement);
	stub.getSlotName.returns('top_leaderboard');
	stub.isEnabled.returns(true);

	return stub;
}

const RESOLVED_STATE_PADDING = '10%';

function getParams() {
	return {
		type: 'bfaa',
		player: 'porvata',
		isMobile: false,
		config: {
			aspectRatio: {
				default: 4,
				resolved: 10,
			},
			background: {
				default: 'default-state-image.jpg',
				resolved: 'resolved-state-image.jpg',
			},
			state: {
				height: {
					default: 92,
					resolved: 100,
				},
				top: {
					default: 4,
					resolved: 0,
				},
			},
		},
		slotName: 'top_leaderboard',
		src: 'test',
		uap: '4466763538',
		lineItemId: '4466763538',
		creativeId: '138218898006',
		isSticky: true,
		backgroundColor: '#000',
		autoPlay: true,
		resolvedStateAutoplay: true,
		videoTriggers: [],
		videoPlaceholderElement: {},
		splitLayoutVideoPosition: 'right',
		image1: {
			element: {
				classList: {
					add: () => {},
				},
			},
			background: 'default-state-image.jpg',
		},
		image2: {
			element: {
				classList: {
					contains: () => false,
					add: () => {},
					remove: () => {},
				},
			},
			background: 'resolved-state-image.jpg',
		},
		adContainer: {
			classList: {
				contains: () => false,
			},
		},
		thumbnail: {
			style: {},
		},
		aspectRatio: 4,
		resolvedStateAspectRatio: 10,
		videoAspectRatio: 1.7777777777777777,
		theme: 'hivi',
		isDarkTheme: false,
		clickThroughURL: 'http://fandom.com',
		fullscreenable: true,
		loadMedrecFromBTF: false,
		moatTracking: 1,
		adProduct: 'vuap',
	};
}

describe('UAP:HiVi template', () => {
	const sandbox = createSandbox();
	let isResolvedStateStub: SinonStub;

	beforeEach(() => {
		isResolvedStateStub = sandbox.stub(resolvedState, 'isResolvedState');
		sandbox
			.stub(context, 'get')
			.withArgs('templates.bfaa')
			.returns({
				mainContainer: document.body,
			});
		sandbox.stub(slotTweaker, 'onReady').resolves({} as any);
		sandbox.stub(slotTweaker, 'makeResponsive').resolves({} as any);
		sandbox.stub(window, 'scrollBy').returns(null);
		sandbox.stub(window, 'addEventListener').returns(null);
		(document.body as any).style = new CSSStyleDeclaration();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should left padding empty for default state (BFAA handles it)', () => {
		const adSlot = getAdSlotObject(sandbox);
		const theme = new BfaaHiviTheme(adSlot as any, getParams() as any);

		isResolvedStateStub.returns(false);

		theme.onAdReady();
		expect(document.body.style.paddingTop).to.equal('');
	});

	it('should set correct padding for resolved state', () => {
		const adSlot = getAdSlotObject(sandbox);
		const theme = new BfaaHiviTheme(adSlot as any, getParams() as any);

		isResolvedStateStub.returns(true);

		theme.onAdReady();

		expect(document.body.style.paddingTop).to.equal(RESOLVED_STATE_PADDING);
	});
});
