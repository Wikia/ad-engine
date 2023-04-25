import { context, utils } from '@wikia/ad-engine';
import { DataWarehouseParams } from '../data-warehouse';
import { DwAggregatedDataGzipCompressor } from './dw-aggregated-data-gzip-compressor';

export type Compressed = {
	contentEncoding?: string;
	compressed: string | Uint8Array;
};

export interface DwAggregatedDataCompressor {
	compressionSupported(): boolean;
	compress(input: string): Promise<Compressed>;
}

/***
 * Sends aggregated data to DW
 * Optionally compresses data before sending
 */
export class DwTrackSender {
	constructor(
		private readonly dataCompressor: DwAggregatedDataCompressor = new DwAggregatedDataGzipCompressor(),
	) {}

	public sendTrackData(trackingUrl: string, paramsAggregated: DataWarehouseParams[]): void {
		const dwTrackingUrlV2 = `${trackingUrl}_v2`;
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
				utils.logger(`dw-track-sender`, { status: 'success', url });
			} else {
				utils.logger(`dw-track-sender`, { status: 'failed', url });
			}
		});
	}
}
