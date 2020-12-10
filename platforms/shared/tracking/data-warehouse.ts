import { context, trackingOptIn, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import * as queryString from 'query-string';
import { TrackingParams } from './models/tracking-params';

const logGroup = 'data-warehouse-trackingParams';
const eventUrl = 'https://beacon.wikia-services.com/__track/special/trackingevent';
const videoEventUrl = 'https://beacon.wikia-services.com/__track/special/videoplayerevent';

export interface TimeBasedParams {
	cb: number;
	url: string;
}

@Injectable()
export class DataWarehouseTracker {
	/**
	 * Call all of the setup trackers
	 */
	track(options: TrackingParams, trackingURL?: string): void {
		const params: TrackingParams = {
			...this.getDataWarehouseParams(),
			...options,
		};

		if (trackingURL) {
			this.sendCustomEvent(params, trackingURL);
		} else {
			this.sendTrackEvent(params);
		}
	}

	/**
	 * Get additional params only for DataWarehouse trackingParams
	 *
	 * @see https://wikia-inc.atlassian.net/wiki/display/FT/Analytics+Data+Model
	 * @see https://docs.google.com/spreadsheets/d/1_C--1KGTuj3cs1un4UM_UnCWUBLhhGkGZKbabNwPWFU/edit#gid=932083905
	 */
	private getDataWarehouseParams(): TrackingParams {
		return {
			session_id: context.get('wiki.sessionId') || 'unknown',
			pv_number: context.get('wiki.pvNumber'),
			pv_number_global: context.get('wiki.pvNumberGlobal'),
			pv_unique_id: context.get('wiki.pvUID'),
			beacon: context.get('wiki.beaconId') || 'unknown',
			c: context.get('wiki.wgCityId') || 'unknown',
			ck: context.get('wiki.dsSiteKey') || 'unknown',
			lc: context.get('wiki.wgUserLanguage') || 'unknown',
			s: context.get('targeting.skin') || 'unknown',
			ua: window.navigator.userAgent,
			u: trackingOptIn.isOptedIn() ? context.get('userId') || 0 : -1,
			a: context.get('targeting.artid') || -1,
			x: context.get('wiki.wgDBname') || 'unknown',
			n: context.get('wiki.wgNamespaceNumber') || -1,
		};
	}

	/**
	 * Send single get request to Data Warehouse using custom route name (defined in config)
	 */
	private sendCustomEvent(options: TrackingParams, trackingURL: string): void {
		const params: TrackingParams & TimeBasedParams = {
			...options,
			...this.getTimeBasedParams(),
		};
		const url = this.buildDataWarehouseUrl(params, trackingURL);

		this.sendRequest(url, params);
	}

	/**
	 * Send the get request to  Data Warehouse
	 */
	private sendTrackEvent(options: TrackingParams, type = 'Event'): void {
		const params: TrackingParams & TimeBasedParams = {
			...options,
			...this.getTimeBasedParams(),
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

		let url = this.buildDataWarehouseUrl(params, eventUrl);
		this.sendRequest(url, params, type);

		// For video player events, send same data to additional endpoint
		if (params.eventName === 'videoplayerevent') {
			url = this.buildDataWarehouseUrl(params, videoEventUrl);
			this.sendRequest(url, params, type);
		}
	}

	private getTimeBasedParams(): TimeBasedParams {
		return {
			cb: Math.floor(Math.random() * 99999),
			url: document.URL,
		};
	}

	/**
	 * Build a URL to send to Data Warehouse
	 */
	private buildDataWarehouseUrl(params: object, baseUrl: string): string {
		if (!baseUrl) {
			const msg = `Error building DW tracking URL`;
			utils.logger(logGroup, msg);
			throw new Error(msg);
		}
		return `${baseUrl}?${queryString.stringify(params, { strict: false })}`;
	}

	/**
	 * Send the get request
	 */
	private sendRequest(url: string, params: object, type = 'Event'): void {
		const request = new XMLHttpRequest();

		request.open('GET', url, true);
		request.responseType = 'json';

		request.addEventListener('load', () =>
			utils.logger(`DW - Track ${type} Success`, { url, params }),
		);
		request.addEventListener('error', (err) =>
			utils.logger(`DW - Track ${type} Failed`, { url, params, err }),
		);

		request.send();
	}
}
