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

		before(() => {
			context = new Context();
			contextPushSpy = spy(context, 'push');
			nativo = new Nativo(context);
		});

		after(() => {
			contextPushSpy.restore();
		});

		afterEach(() => {
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

		it('does not push slot when UAP is on the page', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: true,
				adProduct: 'nothing important',
			};

			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.calledWith('state.adStack', { id: 'mocked_slot' })).to.be.false;
		});

		it('does not push slot when UAP:Roadblock is on the page', () => {
			const uapLoadStatusActionMock: UapLoadStatus = {
				isLoaded: false,
				adProduct: 'ruap',
			};

			nativo.scrollTriggerCallback(uapLoadStatusActionMock, 'mocked_slot');

			expect(contextPushSpy.calledWith('state.adStack', { id: 'mocked_slot' })).to.be.false;
		});
	});
});
