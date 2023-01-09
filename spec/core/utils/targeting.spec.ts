import { targetingService } from '@wikia/core';
import { targeting } from '@wikia/core/utils/targeting';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

let sandbox;

describe('targeting', () => {
	beforeEach(() => {
		sandbox = createSandbox();
	});

	afterEach(() => {
		targetingService.remove('bundles');
		targetingService.remove('rating');
		targetingService.remove('s1');
		targetingService.remove('skin');

		sandbox.restore();
	});

	it('getHostnamePrefix properly detects current environment', () => {
		sandbox.stub(window, 'location').value({
			hostname: 'project43.preview.fandom.com',
		});

		expect(targeting.getHostnamePrefix()).to.equal('preview');
	});

	it('getRawDbName returns proper s1 value', () => {
		expect(targeting.getRawDbName('project43')).to.equal('_project43');
	});

	it('getTargetingBundles returns filtered bundles', () => {
		targetingService.set('s1', '_harrypotter');
		targetingService.set('rating', ['esrb:teen', 'esrb:adult']);
		targetingService.set('skin', 'fandom_desktop');

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					s1: ['_project34', '_harry'],
					rating: ['esrb:teen'],
				},
				bundle2: {
					s1: ['_project43', '_harrypotter'],
					rating: ['esrb:teen'],
				},
				bundle3: {
					skin: ['fandom_desktop'],
				},
			}),
		).to.deep.equal(['bundle2', 'bundle3']);

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					s1: ['_project34', '_harry'],
					rating: ['esrb:teen'],
				},
			}),
		).to.deep.equal([]);

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					rating: ['esrb:adult'],
				},
			}),
		).to.deep.equal(['bundle1']);

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					rating: ['esrb:child'],
				},
			}),
		).to.deep.equal([]);
	});

	it('getTargetingBundles will not add VIDEO_TIER_3_BUNDLE for tier 1 and 2', () => {
		targetingService.set('s1', '_project34');
		targetingService.set('skin', 'ucp_desktop');

		expect(
			targeting.getTargetingBundles({
				VIDEO_TIER_1_AND_2_BUNDLE: {
					s1: ['_project34'],
				},
			}),
		).to.deep.equal(['VIDEO_TIER_1_AND_2_BUNDLE']);

		expect(
			targeting.getTargetingBundles({
				video_tier_1_and_2_bundle: {
					s1: ['_project34'],
				},
			}),
		).to.deep.equal(['video_tier_1_and_2_bundle']);

		expect(
			targeting.getTargetingBundles({
				VIDEO_tier_1_and_2_bundle: {
					s1: ['_project34'],
				},
			}),
		).to.deep.equal(['VIDEO_tier_1_and_2_bundle']);
	});

	it('getTargetingBundles returns backend, frontent and code bundles', () => {
		targetingService.set('bundles', ['backend_bundle']);
		targetingService.set('s1', '_harrypotter');
		targetingService.set('skin', 'ucp_desktop');

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					s1: ['_project34', '_harrypotter'],
				},
				bundle2: {
					skin: ['ucp_desktop'],
				},
			}),
		).to.deep.equal(['backend_bundle', 'bundle1', 'bundle2', 'VIDEO_TIER_3_BUNDLE']);
	});

	it('getTargetingBundles should not overwrite existing bundles', () => {
		targetingService.set('bundles', ['existing_bundle']);
		targetingService.set('s1', '_harrypotter');

		expect(
			targeting.getTargetingBundles({
				EXISTING_BUNDLE: {
					s1: ['_project34', '_harrypotter'],
				},
				existing_BUNDLE: {
					s1: ['_harrypotter'],
				},
				EXISTING_bundle: {
					s1: ['_harrypotter'],
				},
				new_bundle: {
					s1: ['_harrypotter'],
				},
			}),
		).to.deep.equal(['existing_bundle', 'new_bundle']);
	});

	it('getTargetingBundles returns short_page bundle', () => {
		targetingService.set('word_count', 20);

		expect(targeting.getTargetingBundles({})).to.deep.equal(['short_page']);
	});

	it('getTargetingBundles returns an empty array if the page is long', () => {
		targetingService.set('word_count', 2000);

		expect(targeting.getTargetingBundles({})).to.deep.equal([]);
	});

	it('getTargetingBundles returns an empty array if word_count is not defined.', () => {
		expect(targeting.getTargetingBundles({})).to.deep.equal([]);
	});
});
