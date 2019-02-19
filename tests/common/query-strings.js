class QueryStrings {
	constructor() {
		this.instantGlobals = {
			labradorTestVariableAlpha: 'InstantGlobals.wgTestVariableAlpha',
		};
		this.utils = {
			resolved: 'resolved_state',
			cb: 'cb',
			contentLength: 'content_length',
			sessionId: 'sessionid',
			enabledGeo: 'enabled-geo',
			forceEmptyResponse: 'force-empty-response',
			disableFloating: 'floating',
		};
		this.bidders = {
			price: 'wikia_adapter',
			limit: 'wikia_adapter_limit',
			limitSlots: 'limit',
			randomness: 'wikia_adapter_random',
			timeout: 'wikia_adapter_timeout',
			pbjs_debug: 'pbjs_debug',
			disableSlots: 'disabled-slots',
			deals: 'deals',
		};
		this.video = {
			midroll: 'midroll',
			postroll: 'postroll',
			autoplay: 'autoplay',
			mute: 'mute',
			capping: 'capping',
			f15n: 'f15s=MT9YiMPV',
			videoAdapter: 'wikia_video_adapter',
		};
		this.services = {
			krux: 'krux-disabled',
			trackingOptIn: 'tracking-opt-in',
			moat: 'moat-yi-disabled',
			adEngineDelay: 'adengine-delay',
			enabledProjects: 'enabled-project',
		};
	}

	/**
	 * Adds additional parameters to URL.
	 * @param {string} url - base URL
	 * @param {...string} parameters
	 * @returns {string} given URL with added parameters
	 */
	getUrl(url, ...parameters) {
		return `${url}?${parameters.join('&')}`;
	}

	getIGParameters(country = 'XX', percent = null, additional = null) {
		if (percent) {
			if (additional) {
				return `[${country}/${percent}${additional}]`;
			}

			return `[${country}/${percent}]`;
		}

		return `[${country}]`;
	}

	/**
	 * @private
	 * @param {boolean} param
	 * @returns {string}
	 */
	getIsOn(param) {
		return param ? '1' : '0';
	}

	getMidroll(midroll) {
		return `${this.video.midroll}=${this.getIsOn(midroll)}`;
	}

	getPostroll(postroll) {
		const on = postroll ? '1' : '0';

		return `${this.video.postroll}=${on}`;
	}

	getAutoplay(autoplay) {
		const on = autoplay ? '1' : '0';

		return `${this.video.autoplay}=${on}`;
	}

	getMute(mute) {
		const on = mute ? '1' : '0';

		return `${this.video.mute}=${on}`;
	}

	getCapping(capping) {
		return `${this.video.mute}=${capping}`;
	}

	getF15n() {
		return `${this.video.f15n}`;
	}

	getCacheBuster(cb = Date.now()) {
		return `${this.utils.cb}=${cb}`;
	}

	getPrice(price) {
		return `${this.bidders.price}=${price}`;
	}

	getLimit(limit) {
		return `${this.bidders.limit}=${limit}`;
	}

	getLimitOfSlots(limit = 3) {
		return `${this.bidders.limitSlots}=${limit}`;
	}

	getTimeout(timeout) {
		return `${this.bidders.timeout}=${timeout}`;
	}

	getLengthOfContent(lengthNumber = 5) {
		return `${this.utils.contentLength}=${lengthNumber}`;
	}

	getRandom(randomness) {
		const on = randomness ? '1' : '0';

		return `${this.bidders.randomness}=${on}`;
	}

	getResolvedState(resolved) {
		const on = resolved ? '1' : '0';

		return `${this.utils.resolved}=${on}`;
	}

	getKrux(enabled) {
		const on = enabled ? '0' : '1';

		return `${this.services.krux}=${on}`;
	}

	getTrackingOptIn(enabled) {
		const on = enabled ? '1' : '0';

		return `${this.services.trackingOptIn}=${on}`;
	}

	getMoat(enabled) {
		const on = enabled ? '0' : '1';

		return `${this.services.moat}=${on}`;
	}

	getAdEngineDelay(timeout) {
		return `${this.services.adEngineDelay}=${timeout}`;
	}

	getEmptyResponse(empty) {
		const on = empty ? '1' : '0';

		return `${this.utils.forceEmptyResponse}=${on}`;
	}

	getDeals(enabled) {
		const on = enabled ? '1' : '0';

		return `${this.bidders.deals}=${on}`;
	}

	getSessionIdParam(parameter) {
		return `${this.utils.sessionId}=${parameter}`;
	}

	getProjects(...projects) {
		return `${this.services.enabledProjects}=${projects.join(',')}`;
	}

	getTurnedOffSlots(...slots) {
		return `${this.bidders.disableSlots}=${slots.join(',')}`;
	}

	constructInstantGlobal(wg, country = 'XX', percent = null, additional = null) {
		return `${wg}=${this.getIGParameters(country, percent, additional)}`;
	}

	constructSingleGeoInstantGlobal(country = 'XX', percent = null) {
		return `${this.utils.enabledGeo}=${country}/${percent}`;
	}
}

export const queryStrings = new QueryStrings();
