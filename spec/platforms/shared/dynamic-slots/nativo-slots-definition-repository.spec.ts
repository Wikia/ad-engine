import { expect } from 'chai';

import { context, DomListener } from '@wikia/core';
import { NativoSlotsDefinitionRepository } from '@wikia/platforms/shared/dynamic-slots/nativo-slots-definition-repository';

describe('Nativo slots definition repository', () => {
	let domListener, nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository;

	beforeEach(() => {
		domListener = new DomListener();

		nativoSlotDefinitionRepository = new NativoSlotsDefinitionRepository(domListener);

		context.set('services.nativo.enabled', true);
		context.set('slots.ntv_ad.disabled', false);
		context.set('slots.ntv_feed_ad.disabled', false);
		window.ads = {
			...window.ads,
			context: {
				// @ts-expect-error provide only partial context
				opts: {
					enableNativeAds: true,
				},
			},
		};
	});

	afterEach(() => {
		context.set('services.nativo.enabled', undefined);
		context.set('slots.ntv_ad.disabled', undefined);
		context.set('slots.ntv_feed_ad.disabled', undefined);
		delete window.ads;
	});

	it('does not return slots definition when Nativo is disabled', () => {
		context.set('services.nativo.enabled', false);

		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.equal(undefined);
	});

	it('does not return slots definition when Nativo is disabled per community', () => {
		window.ads = {
			...window.ads,
			context: {
				// @ts-expect-error provide only partial context
				opts: {
					enableNativeAds: false,
				},
			},
		};

		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.equal(undefined);
	});

	it('returns slots definition for Nativo - sunny scenario', () => {
		expect(nativoSlotDefinitionRepository.getNativoIncontentAdConfig(1)).to.not.equal(undefined);
		expect(nativoSlotDefinitionRepository.getNativoFeedAdConfig(null)).to.not.equal(undefined);
	});
});
