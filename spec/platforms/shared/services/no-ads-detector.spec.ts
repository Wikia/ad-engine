// @ts-strict-ignore
import { NoAdsDetector } from '@wikia/platforms/shared';
import { expect } from 'chai';

describe('No Ads Detector', () => {
	let noAdsDetector: NoAdsDetector;
	beforeEach(() => {
		noAdsDetector = new NoAdsDetector();
	});

	it('isAdsMode() returns true when reasons array is empty', () => {
		expect(noAdsDetector.isAdsMode()).to.equal(true);
	});

	it('isAdsMode() returns false when reasons array is not empty', () => {
		noAdsDetector.addReason('some_reason');
		expect(noAdsDetector.getReasons().length).to.equal(1);

		expect(noAdsDetector.isAdsMode()).to.equal(false);
	});

	it('addReason() works when trying to add string value', () => {
		noAdsDetector.addReason('some_reason');

		expect(noAdsDetector.getReasons().length).to.equal(1);
		expect(noAdsDetector.getReasons()).to.contain('some_reason');
	});

	it('addReasons() works when trying to add array of strings', () => {
		noAdsDetector.addReasons(['666', '777']);

		expect(noAdsDetector.getReasons().length).to.equal(2);
		expect(noAdsDetector.getReasons()).to.contain('666');
		expect(noAdsDetector.getReasons()).to.contain('777');
	});

	it('addReasons() does not work when trying to add undefined', () => {
		noAdsDetector.addReasons(undefined);

		expect(noAdsDetector.getReasons().length).to.equal(0);
	});

	it('reset() works and cleans out the reasons array', () => {
		noAdsDetector.addReason('some_reason');
		noAdsDetector.addReason('some_reason2');
		noAdsDetector.addReason('some_reason3');

		expect(noAdsDetector.getReasons().length).to.equal(3);

		noAdsDetector.reset();

		expect(noAdsDetector.getReasons().length).to.equal(0);
	});
});
