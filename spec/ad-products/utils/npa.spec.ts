import { assert } from 'chai';
import sinon from 'sinon';
import { context, trackingOptIn } from '../../../src/ad-engine';
import { setupNpaContext } from '../../../src/ad-products/utils/npa';

describe('NPA - setup context ', () => {
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		sandbox.stub(trackingOptIn, 'isOptedIn');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('sets npa targeting for turned off tracking opt-in', () => {
		trackingOptIn.isOptedIn.returns(false);
		setupNpaContext();
		assert.equal(context.get('targeting.npa'), '1');
	});

	it('sets npa targeting for tracking opt-in', () => {
		trackingOptIn.isOptedIn.returns(true);
		setupNpaContext();
		assert.equal(context.get('targeting.npa'), '0');
	});
});
