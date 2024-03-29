// @ts-strict-ignore
import { context, targetingService, trackingOptIn, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdEngineStageSetup } from '../setup/ad-engine-stage.setup';
import { TrackingUrl, trackingUrls } from '../setup/tracking-urls';
import { BatchProcessor } from './batch-processor';
import { dwTrafficAggregator } from './data-warehouse-utils/dw-traffic-aggregator';
import { TrackingParams } from './models/tracking-params';

const logGroup = 'data-warehouse-trackingParams';
const eventUrl = trackingUrls.TRACKING_EVENT.url;
const videoEventUrl = trackingUrls.VIDEO_PLAYER_EVENT.url;

export interface TimeBasedParams {
	cb: number;
	url: string;
}

export type DataWarehouseParams = TrackingParams & TimeBasedParams;

@Injectable()
export class DataWarehouseTracker {
	private adEngineStageSetup: AdEngineStageSetup;
	private eventsArray = [];

	constructor() {
		this.adEngineStageSetup = new AdEngineStageSetup();
		this.init();
	}

	init() {
		if (context.get('options.delayEvents.enabled')) {
			document.addEventListener('readystatechange', () => {
				if (document.readyState === 'complete') {
					this.dispatchAndEmptyEventArray();
				}
			});
		}
	}

	/**
	 * Call all of the setup trackers
	 */
	track(options: TrackingParams, trackingURL?: TrackingUrl): void {
		if (
			trackingURL &&
			!utils.outboundTrafficRestrict.isOutboundTrafficAllowed(
				`dw-tracker-${trackingURL.name.toLowerCase()}`,
			)
		) {
			return;
		}

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
			s: targetingService.get('skin') || 'unknown',
			ua: window.navigator.userAgent,
			u: trackingOptIn.isOptedIn() ? context.get('options.userId') || 0 : -1,
			a: parseInt(targetingService.get('artid') || -1),
			x: context.get('wiki.wgDBname') || 'unknown',
			n: context.get('wiki.wgNamespaceNumber') || -1,
		};
	}

	/**
	 * Send single get request to Data Warehouse using custom route name (defined in config)
	 */
	private sendCustomEvent(options: TrackingParams, trackingURL: TrackingUrl): void {
		const params: DataWarehouseParams = {
			...options,
			...this.getTimeBasedParams(),
		};

		if (
			context.get(`services.dw-tracker-${trackingURL.name.toLowerCase()}.aggregate`) &&
			dwTrafficAggregator.isAggregatorActive()
		) {
			dwTrafficAggregator.push(trackingURL, params);

			// return; // TODO: uncomment in task: ADEN-13038
		}

		const url = this.buildDataWarehouseUrl(params, trackingURL.url);

		this.handleDwEvent(url, params);
	}

	/**
	 * Send the get request to  Data Warehouse
	 */
	private sendTrackEvent(options: TrackingParams, type = 'Event'): void {
		const params: DataWarehouseParams = {
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
		this.handleDwEvent(url, params, type);

		// For video player events, send same data to additional endpoint
		if (params.eventName === 'videoplayerevent') {
			url = this.buildDataWarehouseUrl(params, videoEventUrl);
			this.handleDwEvent(url, params, type);
		}
	}

	private dispatchAndEmptyEventArray(): void {
		const { batchSize, delay } = context.get('options.delayEvents');
		const batchProcessor = new BatchProcessor(this.eventsArray, batchSize, delay);

		batchProcessor.dispatchEventsWithTimeout(this.sendRequest);
		this.eventsArray = [];
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
	private buildDataWarehouseUrl(params: DataWarehouseParams, baseUrl: string): string {
		if (!baseUrl) {
			const msg = `Error building DW tracking URL`;
			utils.logger(logGroup, msg);
			throw new Error(msg);
		}
		return `${baseUrl}?${utils.queryString.stringify(params)}`;
	}

	/**
	 * Send the get request
	 */

	private handleDwEvent(url: string, params: DataWarehouseParams, type = 'Event'): void {
		const event = { url, params, type };
		if (context.get('options.delayEvents.enabled')) {
			this.adEngineStageSetup
				.afterDocumentCompleted()
				.then(() => {
					this.sendRequest(event);
				})
				.catch(() => {
					this.eventsArray.push(event);
				});
		} else {
			this.sendRequest(event);
		}
	}

	private sendRequest({ url, params, type = 'Event' }): void {
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
