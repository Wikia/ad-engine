import { context, utils } from '@ad-engine/core';

const logGroup = 'featured-video-f15s';

export default {
	/**
	 * Checks if for given video we want the f15s experiment to be enabled
	 */
	isEnabled(videoId: string): boolean {
		if (!context.get('options.featuredVideo15sEnabled')) {
			return false;
		}

		const adTime = this.getTime(videoId);

		utils.logger(logGroup, 'isEnabled (video id, time, enabled?)', videoId, adTime, !!adTime);

		return !!adTime;
	},

	/**
	 * Returns time for an ad from the configuration
	 */
	getTime(videoId: string): number {
		return context.get(`options.featuredVideo15sMap.${videoId}`);
	},
};
