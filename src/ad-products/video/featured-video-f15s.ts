import { context, utils } from '@wikia/ad-engine';

const logGroup = 'featured-video-f15s';

export default {
	/**
	 * Checks if for given video we want the f15s experiment to be enabled
	 *
	 * @param {string} videoId a unique mediaId from JWPlayer instance
	 * @returns {boolean}
	 */
	isEnabled(videoId) {
		if (!context.get('options.featuredVideo15sEnabled')) {
			return false;
		}

		const adTime = this.getTime(videoId);

		utils.logger(logGroup, 'isEnabled (video id, time, enabled?)', videoId, adTime, !!adTime);

		return !!adTime;
	},

	/**
	 * Returns time for an ad from the configuration
	 *
	 * @param {string} videoId a unique mediaId from JWPlayer instance
	 * @returns {*}
	 */
	getTime(videoId) {
		return context.get(`options.featuredVideo15sMap.${videoId}`);
	},
};
