import { UapVideoSettings } from '@wikia/ad-products/templates/uap/uap-video-settings';
import { expect } from 'chai';

describe('VideoSettings', () => {
	it('returns correct autoplay value', () => {
		const settings = new UapVideoSettings({ autoPlay: true });

		expect(settings.isAutoPlay()).to.equal(true);
	});
});
