import { context, utils } from '@wikia/ad-engine';
import { DwAggregatedDataGzipCompressor } from './dw-aggregated-data-gzip-compressor';

export type Compressed = {
	contentEncoding?: string;
	compressed: string | Uint8Array;
};

export interface DwAggregatedDataCompressor {
	compressionSupported(): boolean;
	compress(input: string): Promise<Compressed>;
}

const LOG_GROUP_NAME = 'dw-track-sender';
const TEMPORARY_ENDPOINT_SUFFIX = '_v2';

type AggregatedTrackingData = Record<string, string | number>;

/***
 * Sends aggregated data to DW
 * Optionally compresses data before sending
 * v2 endpoint is used for sending uncompressed data
 * v2gzip is used for sending compressed data
 * Since this is a PoC v2 and v2gzip are temporary endpoints
 */
export class DwAggregatedDataSender {
	constructor(
		private readonly dataCompressor: DwAggregatedDataCompressor = new DwAggregatedDataGzipCompressor(),
	) {}

	public sendTrackData(trackingUrl: string, paramsAggregated: AggregatedTrackingData[]): void {
		const dwTrackingUrlV2 = `${trackingUrl}${TEMPORARY_ENDPOINT_SUFFIX}`;
		if (this.isCompressionEnabled()) {
			this.dataCompressor.compress(JSON.stringify(paramsAggregated)).then((result) => {
				this.sendRequest(dwTrackingUrlV2 + result.contentEncoding || '', result.compressed);
			});
			return;
		}
		this.sendRequest(dwTrackingUrlV2, JSON.stringify(paramsAggregated));
	}

	private isCompressionEnabled(): boolean {
		return (
			context.get('services.dw-tracker.compression') && this.dataCompressor.compressionSupported()
		);
	}

	private sendRequest(url: string, payload: string | Uint8Array): void {
		fetch(url, {
			method: 'POST',
			body: payload,
		}).then((response) => {
			if (response.status === 200) {
				utils.logger(LOG_GROUP_NAME, { status: 'success', url });
			} else {
				utils.logger(LOG_GROUP_NAME, { status: 'failed', url });
			}
		});
	}
}
