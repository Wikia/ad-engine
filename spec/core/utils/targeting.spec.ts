import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context } from '../../../src/core';
import { targeting } from '../../../src/core/utils/targeting';

let sandbox;

describe('targeting', () => {
	beforeEach(() => {
		sandbox = createSandbox();
	});

	afterEach(() => {
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
		context.set('targeting.esrb', ['teen', 'adult']);
		context.set('targeting.skin', 'fandom_desktop');

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					s1: ['_project34', '_harry'],
					esrb: ['teen'],
				},
				bundle2: {
					s1: ['_project43', '_harrypotter'],
					esrb: ['teen'],
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
					esrb: ['teen'],
				},
			}),
		).to.deep.equal([]);

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					esrb: ['adult'],
				},
			}),
		).to.deep.equal(['bundle1']);

		expect(
			targeting.getTargetingBundles({
				bundle1: {
					esrb: ['child'],
				},
			}),
		).to.deep.equal([]);
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
});
