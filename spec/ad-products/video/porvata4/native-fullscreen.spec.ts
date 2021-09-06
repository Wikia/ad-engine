import { NativeFullscreen } from '@wikia/ad-products/video/porvata4/native-fullscreen';
import { expect } from 'chai';
import { spy } from 'sinon';

describe.only('native-fullscreen', () => {
	it('should not be supported and send event to DW if the video element is null', () => {
		const testElementMock: HTMLElement = ({ querySelector: () => null } as unknown) as HTMLElement;
		const testInstance = new NativeFullscreen(testElementMock);

		expect(testInstance.isSupported()).to.be.false;
	});

	it('should be supported if the video is valid', () => {
		const testVideoMock = {
			webkitRequestFullscreen: () => {},
			webkitExitFullscreen: () => {},
			onwebkitfullscreenchange: () => {},
		};
		const testElementMock: HTMLElement = ({
			querySelector: () => testVideoMock,
		} as unknown) as HTMLElement;
		const testInstance = new NativeFullscreen(testElementMock);

		expect(testInstance.isSupported()).to.be.true;
	});

	it('should call correct function on enter and exit', () => {
		const testVideoMock = {
			webkitRequestFullscreen: spy(),
			webkitExitFullscreen: spy(),
		};
		const testElementMock: HTMLElement = ({
			querySelector: () => testVideoMock,
		} as unknown) as HTMLElement;
		const testInstance = new NativeFullscreen(testElementMock);

		expect(testVideoMock.webkitRequestFullscreen.called).to.be.false;
		expect(testVideoMock.webkitExitFullscreen.called).to.be.false;

		testInstance.enter();
		expect(testVideoMock.webkitRequestFullscreen.called).to.be.true;

		testInstance.exit();
		expect(testVideoMock.webkitExitFullscreen.called).to.be.true;
	});
});
