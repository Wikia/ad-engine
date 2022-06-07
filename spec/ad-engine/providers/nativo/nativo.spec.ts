import { expect } from 'chai';
import { spy } from 'sinon';

import { Context, context, Nativo, UapLoadStatus } from '../../../../src';

describe('Nativo', () => {
	describe('module', () => {
		after(() => {
			context.remove('services.nativo.enabled');
			context.remove('wiki.opts.enableNativeAds');
		});

		it('is enabled in instant-config and (by default) per wiki', () => {
			const contextMock = new Context();
			contextMock.set('services.nativo.enabled', true);
			contextMock.set('wiki.opts.enableNativeAds', true);

			const nativo = new Nativo(contextMock);
			expect(nativo.isEnabled()).to.equal(true);
		});

		it('is disabled at fandom community level', () => {
			const contextMock = new Context();
			contextMock.set('services.nativo.enabled', true);
			contextMock.set('wiki.opts.enableNativeAds', false);

			const nativo = new Nativo(contextMock);
			expect(nativo.isEnabled()).to.equal(false);
		});

		it('is disabled at instant-config level', () => {
			const contextMock = new Context();
			contextMock.set('services.nativo.enabled', false);
			contextMock.set('wiki.opts.enableNativeAds', true);

			const nativo = new Nativo(contextMock);
			expect(nativo.isEnabled()).to.equal(false);
		});
	});

	describe('scrollTriggerCallback', () => {
		let context;
		let contextPushSpy;
		let nativo;

		beforeEach(() => {
			context = new Context();
			contextPushSpy = spy(context, 'push');
			nativo = new Nativo(context);
		});

		after(() => {
			contextPushSpy.restore();
		});

		afterEach(() => {
			context.remove('custom.hasFeaturedVideo');
			context.remove('state.noAdsExperiment.unitName');
			contextPushSpy.resetHistory();
		});

		it('pushes slot only when UAP or UAP:Roadblock are not loaded', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: false,
				adProduct: 'nothing important',
			};

			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.calledWith('state.adStack', { id: 'mocked_slot' })).to.be.true;
		});

		it('pushes slot when UAP:Roadblock is on the article page (implicit non-FV page)', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: false,
				adProduct: 'ruap',
			};

			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.calledWith('state.adStack', { id: 'mocked_slot' })).to.be.true;
		});

		it('does not push slot when UAP:Roadblock is on the FV page (explicit non-FV page)', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: true,
				adProduct: 'nothing important',
			};

			context.set('custom.hasFeaturedVideo', true);
			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.called).to.be.false;
		});

		it('does not push slot when UAP is on the page', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: true,
				adProduct: 'nothing important',
			};

			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.called).to.be.false;
		});

		it('does not push slot when slot is disabled in experiment', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: false,
				adProduct: 'nothing important',
			};

			context.set('state.noAdsExperiment.unitName', 'mocked_slot');
			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.called).to.be.false;
		});
	});

	describe('extractSlotIdFromNativoNoEventData', () => {
		it('returns proper slot name from correct NoAdEvent data', () => {
			const nativoNoAdEventDataMock = {
				data: [
					{
						id: 1142863,
						adLocation: '#ntv_ad',
					},
				],
			};

			expect(Nativo.extractSlotIdFromNativoNoAdEventData(nativoNoAdEventDataMock)).to.equal(
				'ntv_ad',
			);
		});

		it('returns fallback slot name from partially correct (only id) NoAdEvent data', () => {
			const nativoNoAdEventDataMock = {
				data: [
					{
						id: 1142863,
					},
				],
			};

			expect(Nativo.extractSlotIdFromNativoNoAdEventData(nativoNoAdEventDataMock)).to.equal(
				'ntv_ad',
			);
		});
	});

	describe('extractSlotIdFromNativoCompleteEventData', () => {
		it('returns proper slot name from correct NativoCompleteEvent data', () => {
			const nativoCompleteEventDataMock = {
				data: {
					id: 1142863,
					placement: 1142863,
					adLocation: '#ntv_ad',
				},
			};

			expect(Nativo.extractSlotIdFromNativoCompleteEventData(nativoCompleteEventDataMock)).to.equal(
				'ntv_ad',
			);
		});

		it('returns proper slot name from partially correct NativoCompleteEvent data', () => {
			const nativoCompleteEventDataMock = {
				data: {
					id: 1142863,
					placement: undefined,
					adLocation: '#ntv_ad',
				},
			};

			expect(Nativo.extractSlotIdFromNativoCompleteEventData(nativoCompleteEventDataMock)).to.equal(
				'ntv_ad',
			);
		});
	});
});
