import { utils } from '@wikia/ad-engine';
import { DataWarehouseParams } from '../data-warehouse';

export class DwTrackSender {
	public sendTrackData(trackingUrl: string, paramsAggregated: DataWarehouseParams[]): void {
		const dwTrackingUrlV2 = `${trackingUrl}_v2`;
		this.sendRequest(dwTrackingUrlV2, paramsAggregated);
	}

	private sendRequest(url: string, params: DataWarehouseParams[]): void {
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(params),
		}).then((response) => {
			if (response.status === 200) {
				utils.logger(`dw-track-aggregated`, { status: 'success', url, params });
			} else {
				utils.logger(`dw-track-aggregated`, { status: 'failed', url, params });
			}
		});
	}
}
