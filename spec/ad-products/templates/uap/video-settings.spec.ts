import { expect } from 'chai';
import { VideoSettings } from '../../../../src/ad-products/templates/uap/video-settings';

describe('VideoSettings', () => {
	it('returns correct autoplay value', () => {
		const settings = new VideoSettings({ autoPlay: true });

		expect(settings.isAutoPlay()).to.equal(true);
	});
});
