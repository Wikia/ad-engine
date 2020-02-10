import { JWPlayer } from '../external-types/jwplayer';

export function getVideoId(player: JWPlayer): string {
	const { mediaid } = player.getPlaylistItem() || {};

	return mediaid;
}
