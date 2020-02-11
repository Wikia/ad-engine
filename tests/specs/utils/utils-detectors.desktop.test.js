import { expect } from 'chai';
import { blockDetect } from '../../pages/block-detect.page';
import { deviceDetect } from '../../pages/device-detect.page';
import { browserDetect } from '../../pages/browser-detect.page';
import { helpers } from '../../common/helpers';

describe('It will test utils - detectors', () => {
	it('will check block detect', () => {
		helpers.navigateToUrl(blockDetect.pageLink);
		expect(blockDetect.getDetectorResponse()).to.include('disabled');
	});

	it('will check browser detect', () => {
		helpers.navigateToUrl(browserDetect.pageLink);
		expect(browserDetect.getDetectorResponse()).to.include('Chrome');
	});

	it('will check device detect', () => {
		helpers.navigateToUrl(deviceDetect.pageLink);
		expect(deviceDetect.getDetectorResponse()).to.include('desktop');
	});
});
