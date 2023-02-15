import { expect } from 'chai';

import { JWPlayerManager, jwpReady } from '@wikia/ad-products';
import { communicationService } from '@wikia/communication';
import { context, utils } from '@wikia/core';

describe('JWPlayerManager', () => {
	const jwpReadyPayloadStub = {
		playerKey: 'fakePlayer',
		targeting: {
			plist: '',
			vtags: '',
		},
		options: {
			slotName: 'video',
			audio: false,
			ctp: false,
			featured: false,
			videoId: 'xyz',
		},
	};
	const fakePlayerStub = {
		getConfig: () => {
			return { autostart: true };
		},
		getMute: () => false,
		getPlaylistItem: () => {},
		on: () => {},
	};

	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox.stub(utils.scriptLoader, 'loadScript');
		window['fakePlayer'] = fakePlayerStub;
		context.set('options.video.moatTracking.jwplayerPluginUrl', undefined);

		communicationService.emit(
			{
				name: '[JWPlayer] Player Ready',
				action: jwpReady,
			},
			jwpReadyPayloadStub,
		);
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		window['fakePlayer'] = undefined;
		context.remove('options.video.moatTracking.jwplayerPluginUrl');
	});

	it('does not load MOAT when plugin URL is not defined', () => {
		const jwpManager = new JWPlayerManager();
		jwpManager.manage();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('loads MOAT when plugin URL is defined', () => {
		context.set('options.video.moatTracking.jwplayerPluginUrl', 'https://fake-url.com');
		const jwpManager = new JWPlayerManager();
		jwpManager.manage();

		expect(loadScriptStub.called).to.equal(true);
	});
});
