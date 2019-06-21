import { context, trackingOptIn, utils } from '@wikia/ad-engine';
import * as queryString from 'query-string';
import { TrackingParams } from './models/tracking-params';

const logGroup = 'data-warehouse-trackingParams';
const eventUrl = 'https://beacon.wikia-services.com/__track/special/trackingevent';
const videoEventUrl = 'https://beacon.wikia-services.com/__track/special/videoplayerevent';

export interface TimeBasedParams {
	cb: number;
	url: string;
}

export class DataWarehouseTracker {
	/**
	 * Get additional params only for datawarehouse trackingParams
	 *
	 * @see https://wikia-inc.atlassian.net/wiki/display/FT/Analytics+Data+Model
	 * @see https://docs.google.com/spreadsheets/d/1_C--1KGTuj3cs1un4UM_UnCWUBLhhGkGZKbabNwPWFU/edit#gid=932083905
	 */
	private static getDatawarehouseParams(): TrackingParams {
		return {
			session_id: window.session_id,
			pv_number: window.pvNumber,
			pv_number_global: window.pvNumberGlobal,
			pv_unique_id: window.pvUID,
			beacon: window.beacon_id || 'gp_undefined',
			ck: context.get('targeting.wikiId'),
			lc: context.get('targeting.userLanguage'),
			s: context.get('targeting.skin'),
			ua: window.navigator.userAgent,
			u: trackingOptIn.isOptedIn() ? context.get('userId') || 0 : -1,
			a: context.get('targeting.articleId'),
			x: context.get('targeting.DBName'),
			n: context.get('targeting.namespaceNumber'),
		};
	}

	private static getTimeBasedParams(): TimeBasedParams {
		return {
			cb: Math.floor(Math.random() * 99999),
			url: document.URL,
		};
	}

	/**
	 * Build a URL to send to Data Warehouse
	 */
	private static buildDataWarehouseUrl(params: object, baseUrl: string): string {
		if (!baseUrl) {
			const msg = `Error building DW tracking URL`;
			utils.logger(logGroup, msg);
			throw new Error(msg);
		}
		return `${baseUrl}?${queryString.stringify(params)}`;
	}

	/**
	 * Send the get request
	 */
	private sendRequest(url: string, params: object, type = 'Event'): void {
		$.get({
			url,
			// Don't send the csrf token
			headers: null,
		})
			.done(() => {
				utils.logger(`DW - Track ${type} Success`, { url, params });
			})
			.fail((err) => {
				utils.logger(`DW - Track ${type} Failed`, { url, params, err });
			});
	}

	/**
	 * Send the get request to  Data Warehouse
	 */
	private sendTrackEvent(options: TrackingParams, type = 'Event'): void {
		const params: TrackingParams & TimeBasedParams = {
			...options,
			...DataWarehouseTracker.getTimeBasedParams(),
		};

		// Prefix action, label, and category and remove unprefixed properties
		params.ga_category = params.category || '';
		params.ga_label = params.label || '';
		params.ga_action = params.action || '';
		params.ga_value = params.value || '';
		delete params.category;
		delete params.label;
		delete params.action;
		delete params.value;

		let url = DataWarehouseTracker.buildDataWarehouseUrl(params, eventUrl);
		this.sendRequest(url, params, type);

		// For video player events, send same data to additional endpoint
		if (params.eventName === 'videoplayerevent') {
			url = DataWarehouseTracker.buildDataWarehouseUrl(params, videoEventUrl);
			this.sendRequest(url, params, type);
		}
	}

	/**
	 * Send single get request to Data Warehouse using custom route name (defined in config)
	 */
	private sendCustomEvent(options: TrackingParams, trackingURL: string): void {
		const params: TrackingParams & TimeBasedParams = {
			...options,
			...DataWarehouseTracker.getTimeBasedParams(),
		};
		const url = DataWarehouseTracker.buildDataWarehouseUrl(params, trackingURL);

		this.sendRequest(url, params);
	}

	/**
	 * Call all of the setup trackers
	 */
	track(options: TrackingParams, trackingURL?: string): void {
		const params: TrackingParams = {
			...DataWarehouseTracker.getDatawarehouseParams(),
			...options,
		};

		if (trackingURL) {
			this.sendCustomEvent(params, trackingURL);
		} else {
			this.sendTrackEvent(params);
		}
	}

	/**
	 * Send a page view to Data Warehouse
	 */
	private pageView(options?: TrackingParams): void {
		const params: TrackingParams = {
			...DataWarehouseTracker.getDatawarehouseParams(),
			...options,
			t: 'pageview',
			category: 'pageview',
		};
		this.sendTrackEvent(params);

		utils.logger(logGroup, 'DW - pageView()', params);
	}

	/**
	 * Add the global default params to the dwParams and send the PageView event
	 */
	init(defaultTrackingParams: TrackingParams): void {
		const datawarehouseParams: TrackingParams = {
			...DataWarehouseTracker.getDatawarehouseParams(),
			...defaultTrackingParams,
		};
		$.extend(datawarehouseParams, defaultTrackingParams);
		this.pageView();
	}
}
