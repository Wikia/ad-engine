import { expect } from 'chai';

import { Nativo } from '../../../../src/ad-engine/providers/nativo/nativo';
import { Context } from '../../../../src/ad-engine/services/context-service';

describe('Nativo', () => {
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
