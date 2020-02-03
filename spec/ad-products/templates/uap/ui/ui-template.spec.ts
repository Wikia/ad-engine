import { UapVideoSettings } from '@wikia/ad-products/templates/uap/uap-video-settings';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import CloseButton from '../../../../../src/ad-products/templates/interface/video/close-button';
import ReplayOverlay from '../../../../../src/ad-products/templates/interface/video/replay-overlay';
import { selectTemplate } from '../../../../../src/ad-products/templates/interface/video/ui-template';

function getContainer() {
	return document.createElement('div');
}

describe('UITemplate', () => {
	const sandbox = createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it('Should show close button element if there is no autoplay and there is no split screen', () => {
		const videoSettings = new UapVideoSettings({
			autoPlay: true,
			container: getContainer(),
		} as any);

		sandbox.stub(videoSettings, 'isAutoPlay').returns(false);
		sandbox.stub(videoSettings, 'isSplitLayout').returns(false);

		expect(selectTemplate(videoSettings).includes(CloseButton)).to.equal(true);
		expect(selectTemplate(videoSettings).includes(ReplayOverlay)).to.equal(false);
	});

	it('Should hide close button element if there is autoplay for not split ad', () => {
		const videoSettings = new UapVideoSettings({ container: getContainer() } as any);

		sandbox.stub(videoSettings, 'isAutoPlay').returns(true);
		sandbox.stub(videoSettings, 'isSplitLayout').returns(false);

		expect(selectTemplate(videoSettings).includes(CloseButton)).to.equal(false);
		expect(selectTemplate(videoSettings).includes(ReplayOverlay)).to.equal(false);
	});

	it('Should hide close button element if there is auto play for split ad', () => {
		const videoSettings = new UapVideoSettings({ container: getContainer() } as any);

		sandbox.stub(videoSettings, 'isAutoPlay').returns(true);
		sandbox.stub(videoSettings, 'isSplitLayout').returns(true);

		expect(selectTemplate(videoSettings).includes(CloseButton)).to.equal(false);
		expect(selectTemplate(videoSettings).includes(ReplayOverlay)).to.equal(true);
	});

	it('Should show replay button and close for click to play and split', () => {
		const videoSettings = new UapVideoSettings({ container: getContainer() } as any);

		sandbox.stub(videoSettings, 'isAutoPlay').returns(false);
		sandbox.stub(videoSettings, 'isSplitLayout').returns(true);

		expect(selectTemplate(videoSettings).includes(CloseButton)).to.equal(true);
		expect(selectTemplate(videoSettings).includes(ReplayOverlay)).to.equal(true);
	});
});
