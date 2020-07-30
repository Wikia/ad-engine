import {
	audigent,
	bidders,
	confiant,
	context,
	durationMedia,
	iasPublisherOptimization,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { wadRunner } from '../../services/wad-runner';
import { startAdEngine } from '../start-ad-engine';
import { AdsMode } from './_ads.mode';

@Injectable()
export class SportsAdsMode implements AdsMode {
	execute(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.requestBids());
		inhibitors.push(wadRunner.call());

		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'cdm-zone-01' });
		context.push('state.adStack', { id: 'cdm-zone-02' });
		context.push('state.adStack', { id: 'cdm-zone-03' });
		context.push('state.adStack', { id: 'cdm-zone-06' });
		context.push('events.pushOnScroll.ids', 'cdm-zone-04');
	}
}
