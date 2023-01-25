import { context } from '@wikia/core';
import { targeting } from '@wikia/core/utils/targeting';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

let sandbox;

describe('targeting', () => {
	beforeEach(() => {
		sandbox = createSandbox();
	});

	afterEach(() => {
		context.remove('targeting.bundles');
		context.remove('targeting.rating');
		context.remove('targeting.s1');
		context.remove('targeting.skin');

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
		context.set('targeting.s1', '_harrypotter');
		context.set('targeting.rating', ['esrb:teen', 'esrb:adult']);
		context.set('targeting.skin', 'fandom_desktop');

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
		context.set('targeting.s1', '_project34');
		context.set('targeting.skin', 'ucp_desktop');

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
		context.set('targeting.bundles', ['backend_bundle']);
		context.set('targeting.s1', '_harrypotter');
		context.set('targeting.skin', 'ucp_desktop');

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
		context.set('targeting.bundles', ['existing_bundle']);
		context.set('targeting.s1', '_harrypotter');

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
		context.set('targeting.word_count', 20);

		expect(targeting.getTargetingBundles({})).to.deep.equal(['short_page']);
	});

	it('getTargetingBundles returns an empty array if the page is long', () => {
		context.set('targeting.word_count', 2000);

		expect(targeting.getTargetingBundles({})).to.deep.equal([]);
	});

	it('getTargetingBundles returns an empty array if word_count is not defined.', () => {
		expect(targeting.getTargetingBundles({})).to.deep.equal([]);
	});
});
