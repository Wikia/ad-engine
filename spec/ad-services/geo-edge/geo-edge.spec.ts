import { expect } from 'chai';
import { context } from '../../../src/ad-engine/index';
import { geoEdge } from '../../../src/ad-services/geo-edge';

describe('Geo Edge service', () => {
	it('is disabled if context variable is set to false', () => {
		context.set('services.geoEdge.enabled', false);

		expect(typeof geoEdge.call()).to.equal('object');
		expect(window.grumi).to.equal(undefined);

		context.set('services.geoEdge.enabled', true);
		context.set('services.geoEdge.id', '');

		expect(typeof geoEdge.call()).to.equal('object');
		expect(window.grumi).to.equal(undefined);
	});
});
