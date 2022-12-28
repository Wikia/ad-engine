import { JWPlayer } from '@wikia/ad-products/video/jwplayer/external-types/jwplayer';
import { SinonSandbox, SinonStub } from 'sinon';

export type JwplayerStub = { [key in keyof JWPlayer]: SinonStub & JWPlayer[key] };

export function createJwplayerStub(sandbox: SinonSandbox): JwplayerStub {
	return {
		getConfig: sandbox.stub().returns({}),
		getContainer: sandbox.stub(),
		getMute: sandbox.stub().returns(false),
		getPlaylist: sandbox.stub().returns([]),
		getPlaylistIndex: sandbox.stub().returns(0),
		getPlaylistItem: sandbox.stub(),
		off: sandbox.stub(),
		on: sandbox.stub(),
		once: sandbox.stub(),
		pause: sandbox.stub(),
		pauseAd: sandbox.stub(),
		play: sandbox.stub(),
		playAd: sandbox.stub(),
		playlistItem: sandbox.stub(),
		setMute: sandbox.stub(),
		stop: sandbox.stub(),
		trigger: sandbox.stub(),
	};
}
