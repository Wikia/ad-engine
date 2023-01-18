import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsBaseContextSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		this.setBaseState();
		this.setServicesContext();
	}

	private setBaseState(): void {
		const isDesktop = utils.client.isDesktop();

		context.set('custom.device', isDesktop ? '' : 'm');
		context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441);
		context.set('custom.pagePath', this.getPagePathFromUtagData());
		context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src'));

		// identity
		context.set('services.liveConnect.enabled', this.instantConfig.get('icLiveConnect'));
		context.set(
			'services.liveConnect.cachingStrategy',
			this.instantConfig.get('icLiveConnectCachingStrategy'),
		);

		context.set('services.liveRampPixel.enabled', this.instantConfig.get('icLiveRampPixel'));

		context.set('services.ppid.enabled', this.instantConfig.get('icPpid'));
		context.set('services.ppidRepository', this.instantConfig.get('icPpidRepository'));
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}

	private setServicesContext(): void {
		context.set('services.captify.enabled', this.instantConfig.get('icCaptify'));
		context.set('services.confiant.enabled', this.instantConfig.get('icConfiant'));
		context.set('services.durationMedia.enabled', this.instantConfig.get('icDurationMedia'));
		context.set(
			'services.iasPublisherOptimization.enabled',
			this.instantConfig.get('icIASPublisherOptimization'),
		);
	}

	private getPagePathFromUtagData(): string {
		const utagData = this.getUtagData();

		if (!utagData) {
			return '';
		}

		if (!utagData.siteSection) {
			return '';
		}

		return '/' + utagData.siteSection;
	}

	getUtagData() {
		const utagData = window.utag_data;
		utils.logger('setup', 'utag data: ', utagData);
		return utagData;
	}
}
