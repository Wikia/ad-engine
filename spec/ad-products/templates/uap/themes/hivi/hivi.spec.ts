import { expect } from 'chai';
import * as sinon from 'sinon';
import { context, slotTweaker } from '../../../../../../src/ad-engine';
import { resolvedState } from '../../../../../../src/ad-products/templates/uap/resolved-state';
import { BfaaHiviTheme } from '../../../../../../src/ad-products/templates/uap/themes/hivi';

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

function getAdSlotObject() {
	return {
		getElement: () => getSlotElement(),
		getSlotName: () => 'top_leaderboard',
		isEnabled: () => true,
	};
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
			element: {},
			background: 'default-state-image.jpg',
		},
		image2: {
			element: {
				classList: {
					contains: () => false,
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
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();

		sandbox
			.stub(context, 'get')
			.withArgs('templates.bfaa')
			.returns({
				mainContainer: document.body,
			});
		sandbox.stub(slotTweaker, 'onReady').returns({ then: () => {} });
		sandbox.stub(slotTweaker, 'makeResponsive');
		sandbox.stub(resolvedState, 'isResolvedState');
		sandbox.stub(global.window, 'scrollBy');
		sandbox.stub(global.window, 'addEventListener');
		global.document.body.style = new CSSStyleDeclaration();

		slotTweaker.onReady.returns({ then: () => {} });
		slotTweaker.makeResponsive.returns({ then: () => {} });
		global.window.scrollBy.returns(null);
		global.window.addEventListener.returns(null);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should left padding empty for default state (BFAA handles it)', () => {
		const adSlot = getAdSlotObject();
		const theme = new BfaaHiviTheme(adSlot, getParams());

		resolvedState.isResolvedState.returns(false);

		theme.onAdReady();
		expect(document.body.style.paddingTop).to.equal('');
	});

	it('should set correct padding for resolved state', () => {
		const adSlot = getAdSlotObject();
		const theme = new BfaaHiviTheme(adSlot, getParams());

		resolvedState.isResolvedState.returns(true);

		theme.onAdReady();

		expect(document.body.style.paddingTop).to.equal(RESOLVED_STATE_PADDING);
	});
});
