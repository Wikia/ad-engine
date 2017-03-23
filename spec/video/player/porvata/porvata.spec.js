import sinon from 'sinon';
import { PorvataPlayer } from '../../../../src/video/player/porvata/porvata';

let mocks = {};

QUnit.module('Porvata test', {
	beforeEach: () => {
		mocks = {
			domElement: {
				style: {},
				classList: {
					add: () => {}
				}
			},
			params: {
				width: 100,
				height: 100,
				container: {
					querySelector: () => mocks.domElement
				},
				viewportOffsetTop: 0,
				viewportOffsetBottom: 0
			},
			ima: {
				addEventListener: () => {},
				dispatchEvent: () => {},
				getAdsManager: () => mocks.adsManager,
				getStatus: () => {},
				playVideo: () => {},
				reload: () => {},
				resize: () => {}
			},
			adsManager: {
				getRemainingTime: () => {},
				getVolume: () => {},
				pause: () => {},
				resume: () => {},
				setVolume: () => {},
				stop: () => {}
			}
		};
	}
});

QUnit.test('Player with proper interface and properties', (assert) => {
	const player = new PorvataPlayer(mocks.ima, mocks.params);

	assert.equal(player.ima, mocks.ima);
	assert.equal(typeof player.container, 'object');
	assert.equal(typeof player.addEventListener, 'function');
	assert.equal(typeof player.getRemainingTime, 'function');
	assert.equal(typeof player.isMuted, 'function');
	assert.equal(typeof player.isPaused, 'function');
	assert.equal(typeof player.isPlaying, 'function');
	assert.equal(typeof player.pause, 'function');
	assert.equal(typeof player.play, 'function');
	assert.equal(typeof player.reload, 'function');
	assert.equal(typeof player.resize, 'function');
	assert.equal(typeof player.resume, 'function');
	assert.equal(typeof player.setVolume, 'function');
	assert.equal(typeof player.stop, 'function');
});

QUnit.test('Player calls IMA API', (assert) => {
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

	const player = new PorvataPlayer(mocks.ima, mocks.params);

	player.addEventListener('loaded', () => {});
	assert.ok(mocks.ima.addEventListener.calledOnce);

	player.isPaused();
	assert.ok(mocks.ima.getStatus.calledOnce);

	player.play();
	assert.ok(mocks.ima.playVideo.calledOnce);

	player.reload();
	assert.ok(mocks.ima.reload.calledOnce);

	player.resize();
	assert.ok(mocks.ima.resize.calledOnce);

	player.getRemainingTime();
	assert.ok(mocks.adsManager.getRemainingTime.calledOnce);

	player.isMuted();
	assert.ok(mocks.adsManager.getVolume.calledOnce);

	player.resume();
	assert.ok(mocks.adsManager.resume.calledOnce);

	player.setVolume();
	assert.ok(mocks.adsManager.setVolume.calledOnce);

	player.stop();
	assert.ok(mocks.adsManager.stop.calledOnce);
});
