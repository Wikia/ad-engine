import { expect } from 'chai';

import { NativoSlotsDefinitionRepository } from '../../../../platforms/shared/dynamic-slots/nativo-slots-definition-repository';
import { context, DomListener } from '../../../../src/ad-engine';

describe('Nativo slots definition repository', () => {
	let domListener, nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository;

	beforeEach(() => {
		domListener = new DomListener();

		nativoSlotDefinitionRepository = new NativoSlotsDefinitionRepository(domListener);

		context.set('services.nativo.enabled', true);
		context.set('wiki.opts.enableNativeAds', true);
		context.set('slots.ntv_ad.disabled', false);
		context.set('slots.ntv_feed_ad.disabled', false);
	});

	after(() => {
		context.set('services.nativo.enabled', undefined);
		context.set('wiki.opts.enableNativeAds', undefined);
		context.set('slots.ntv_ad.disabled', undefined);
		context.set('slots.ntv_feed_ad.disabled', undefined);
	});

	it('does not return slots definition when Nativo is disabled', () => {
		context.set('services.nativo.enabled', false);

		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.equal(undefined);
	});

	it('does not return slots definition when Nativo is disabled per community', () => {
		context.set('wiki.opts.enableNativeAds', false);

		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.equal(undefined);
	});

	it('does not return slot definition for Nativo incontent slot when it is disabled', () => {
		context.set('slots.ntv_ad.disabled', true);

		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.not.equal(undefined);
	});

	it('does not return slot definition for Nativo feed slot when it is disabled', () => {
		context.set('slots.ntv_feed_ad.disabled', true);

		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.not.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.equal(undefined);
	});

	it('returns slots definition for Nativo - sunny scenario', () => {
		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.not.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.not.equal(undefined);
	});
});
