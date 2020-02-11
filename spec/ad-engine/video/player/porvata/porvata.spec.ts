import { expect } from 'chai';
import * as sinon from 'sinon';
import { PorvataPlayer } from '../../../../../src/ad-products/video/player/porvata/porvata';

let mocks: any = {};

describe('porvata', () => {
	beforeEach(() => {
		mocks = {
			domElement: {
				style: {},
				classList: {
					add: () => {},
				},
			},
			params: {
				width: 100,
				height: 100,
				container: {
					querySelector: () => mocks.domElement,
				},
				viewportOffsetTop: 0,
				viewportOffsetBottom: 0,
			},
			ima: {
				addEventListener: () => {},
				dispatchEvent: () => {},
				getAdsManager: () => mocks.adsManager,
				getStatus: () => {},
				playVideo: () => {},
				reload: () => {},
				resize: () => {},
			},
			adsManager: {
				getRemainingTime: () => {},
				getVolume: () => {},
				pause: () => {},
				resume: () => {},
				setVolume: () => {},
				stop: () => {},
			},
		};
	});

	it('player with proper interface and properties', () => {
		const player = new PorvataPlayer(mocks.ima as any, mocks.params as any, {} as any);

		expect(player.ima).to.equal(mocks.ima);
		expect(typeof player.container).to.equal('object');
		expect(typeof player.addEventListener).to.equal('function');
		expect(typeof player.getRemainingTime).to.equal('function');
		expect(typeof player.isMuted).to.equal('function');
		expect(typeof player.isPaused).to.equal('function');
		expect(typeof player.isPlaying).to.equal('function');
		expect(typeof player.pause).to.equal('function');
		expect(typeof player.play).to.equal('function');
		expect(typeof player.reload).to.equal('function');
		expect(typeof player.resize).to.equal('function');
		expect(typeof player.resume).to.equal('function');
		expect(typeof player.setVolume).to.equal('function');
		expect(typeof player.stop).to.equal('function');
		expect(typeof player.destroy).to.equal('function');
	});

	it('player calls IMA API', () => {
		sinon.spy(mocks.ima, 'addEventListener');
		sinon.spy(mocks.ima, 'dispatchEvent');
		sinon.spy(mocks.ima, 'getStatus');
		sinon.spy(mocks.ima, 'playVideo');
		sinon.spy(mocks.ima, 'reload');
		sinon.spy(mocks.ima, 'resize');
		sinon.spy(mocks.adsManager, 'getRemainingTime');
		sinon.spy(mocks.adsManager, 'getVolume');
		sinon.spy(mocks.adsManager, 'resume');
		sinon.spy(mocks.adsManager, 'setVolume');
		sinon.spy(mocks.adsManager, 'stop');

		const player = new PorvataPlayer(mocks.ima as any, mocks.params as any, {} as any);

		player.addEventListener('loaded', () => {});
		expect(mocks.ima.addEventListener.calledOnce).to.be.ok;

		player.isPaused();
		expect(mocks.ima.getStatus.calledOnce).to.be.ok;

		player.play();
		expect(mocks.ima.playVideo.calledOnce).to.be.ok;

		player.reload();
		expect(mocks.ima.reload.calledOnce).to.be.ok;

		player.resize();
		expect(mocks.ima.resize.calledOnce).to.be.ok;

		player.getRemainingTime();
		expect(mocks.adsManager.getRemainingTime.calledOnce).to.be.ok;

		player.isMuted();
		expect(mocks.adsManager.getVolume.calledOnce).to.be.ok;

		player.resume();
		expect(mocks.adsManager.resume.calledOnce).to.be.ok;

		player.setVolume(50);
		expect(mocks.adsManager.setVolume.calledOnce).to.be.ok;

		player.stop();
		expect(mocks.adsManager.stop.calledOnce).to.be.ok;
	});

	it('destroy calls defined destroy callbacks', () => {
		const destroyCallback = sinon.spy();
		const player = new PorvataPlayer(mocks.ima as any, mocks.params as any, {} as any);

		player.addOnDestroyCallback(destroyCallback);
		player.destroy();

		expect(destroyCallback.calledOnce).to.be.true;
	});
});
