import { utils } from '@wikia/core';
import { RegionMatcher } from '@wikia/ad-services/instant-config/matchers/region-matcher';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Region Matcher', () => {
	let isProperGeoStub: sinon.SinonStub;
	const regionMatcher = new RegionMatcher();

	beforeEach(() => {
		isProperGeoStub = sinon.stub(utils.geoService, 'isProperGeo');
		isProperGeoStub.returns(true);
	});

	afterEach(() => {
		isProperGeoStub.restore();
	});

	it('should work for empty', () => {
		const isValid = regionMatcher.isValid();
		expect(isValid).to.be.true;
	});

	it('should work for empty array', () => {
		const isValid = regionMatcher.isValid([]);
		expect(isValid).to.be.true;
	});

	it('should filter out invalid', () => {
		regionMatcher.isValid(['XX/25-cached', 'US-cached', 'PL/25', 'non-PL', 'UK']);
		expect(isProperGeoStub.getCall(0).args[0]).to.deep.equal(['non-PL', 'UK']);
	});
});
