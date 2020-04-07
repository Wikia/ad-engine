import { context, externalLogger } from '@ad-engine/core';
import { JWPlayerEventParams } from './external-types/jwplayer';

/**
 * This is a temporary class for A9 errors debugging
 *
 * TODO: Remove it and its usage after finished A9 debugging
 */
class JWPlayerA9Logger {
	log(payload: JWPlayerEventParams['adError']) {
		const bid = context.get('slots.featured.targeting.amznbid');
		const bidId = context.get('slots.featured.targeting.amzniid');

		if (bid && bidId && payload.code === 303) {
			const vastUrl = `//aax.amazon-adsystem.com/e/dtb/vast?b=${bidId}&pp=${bid}&rnd=${Math.random()}`;

			fetch(vastUrl)
				.then((response: Response) => response.text())
				.then((vast: string) => {
					externalLogger.log('jwplayer a9 error', {
						bid,
						bidId,
						buyerId: context.get('slots.featured.targeting.amznp'),
						vast,
						vastUrl,
					});
				});
		}
	}
}

export const jwplayerA9Logger = new JWPlayerA9Logger();
