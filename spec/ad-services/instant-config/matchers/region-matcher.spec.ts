import { utils } from '@wikia/ad-engine';
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
		regionMatcher.isProperRegion({});

		expect(isProperGeoStub.getCall(0).args[0]).to.deep.equal([]);
	});

	it('should filter out invalid', () => {
		regionMatcher.isProperRegion({
			regions: ['XX/25-cached', 'US-cached', 'PL/25', 'non-PL', 'UK'],
		});

		expect(isProperGeoStub.getCall(0).args[0]).to.deep.equal(['non-PL', 'UK']);
	});

	it('should apply sampling', () => {
		regionMatcher.isProperRegion({ regions: ['non-PL', 'UK'], sampling: 12.45 });

		expect(isProperGeoStub.getCall(0).args[0]).to.deep.equal(['non-PL/12.45', 'UK/12.45']);
	});

	it('should apply sampling with cache', () => {
		regionMatcher.isProperRegion({
			regions: ['non-PL', 'UK'],
			sampling: 12.45,
			samplingCache: true,
		});

		expect(isProperGeoStub.getCall(0).args[0]).to.deep.equal([
			'non-PL/12.45-cached',
			'UK/12.45-cached',
		]);
	});

	it('should not apply cache without sampling', () => {
		regionMatcher.isProperRegion({ regions: ['non-PL', 'UK'], samplingCache: true });

		expect(isProperGeoStub.getCall(0).args[0]).to.deep.equal(['non-PL', 'UK']);
	});
});
