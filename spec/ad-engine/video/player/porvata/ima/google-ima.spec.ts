import { GoogleIma } from '@wikia/ad-engine/video/player/porvata/ima/google-ima';
import { expect } from 'chai';
import { getIma } from '../ima-factory';

let mocks;

describe('google-ima', () => {
	beforeEach(() => {
		mocks = {
			adDisplayContainer: {
				initialize: () => {},
			},
			domElement: {
				style: {},
				classList: {
					add: () => {},
				},
				contentWindow: {
					location: {},
				},
			},
			videoParams: {
				container: {
					classList: {
						add: () => {},
					},
					querySelector: () => mocks.domElement,
				},
				height: 100,
				slotName: 'top_leaderboard',
				width: 100,
			},
			videoSettings: {
				get(key) {
					return mocks.videoParams[key];
				},
				getParams() {
					return mocks.videoParams;
				},
				getContainer() {
					return mocks.videoParams.container;
				},
				getVpaidMode() {
					return 2;
				},
			},
		};
		window.google = {
			ima: getIma(),
		};
	});

	it('create player using factory', async () => {
		const googleIma = await GoogleIma.init();
		const player = googleIma.getPlayer(mocks.videoSettings);

		expect(typeof player.playVideo).to.equal('function');
	});
});
