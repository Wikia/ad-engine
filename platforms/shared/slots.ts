import {
	AdSlot,
	context,
	getAdProductInfo,
	slotService,
	utils,
	VideoParams,
} from '@wikia/ad-engine';

class SlotsContext {
	addSlotSize(slotName: string, size: [number, number]): void {
		const definedViewportSizes = context.get(`slots.${slotName}.sizes`);

		context.push(`slots.${slotName}.defaultSizes`, size);
		definedViewportSizes.forEach((sizeMap) => {
			sizeMap.sizes.push(size);
		});
	}

	setupSlotVideoAdUnit(adSlot: AdSlot, params: VideoParams): void {
		const adProductInfo = getAdProductInfo(adSlot.getSlotName(), params.type, params.adProduct);
		const adUnit = utils.stringBuilder.build(
			context.get(`slots.${adSlot.getSlotName()}.videoAdUnit`) || context.get('vast.adUnitId'),
			{
				slotConfig: {
					group: adProductInfo.adGroup,
					adProduct: adProductInfo.adProduct,
				},
			},
		);

		context.set(`slots.${adSlot.getSlotName()}.videoAdUnit`, adUnit);
	}

	generate(): any {
		return {
			'cdm-zone-01': {
				aboveTheFold: true,
				defaultSizes: [[728, 90], [970, 150], [970, 250]],
				firstCall: true,
				bidderAlias: '01_LB',
				group: '01_LB',
				sizes: [
					{
						viewportSize: [1024, 300],
						sizes: [[728, 90], [970, 150], [970, 250], [980, 150], [980, 250]],
					},
					{
						viewportSize: [970, 200],
						sizes: [[728, 90], [970, 150], [970, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [0, 0],
						sizes: [[320, 50], [320, 100]],
						mobileViewport: true,
					},
				],
				targeting: {
					loc: 'top',
					zne: '01',
					rv: 1,
				},
			},
			'cdm-zone-02': {
				aboveTheFold: true,
				autoplay: true,
				audio: false,
				disableExpandAnimation: true,
				defaultSizes: [[300, 250], [300, 600]],
				bidderAlias: '02_MR',
				group: '02_MR',
				targeting: {
					loc: 'top',
					zne: '02',
					rv: 1,
				},
			},
			'cdm-zone-03': {
				defaultSizes: [[300, 250]],
				group: '03_PF',
				bidderAlias: '03_PF',
				targeting: {
					loc: 'footer',
					zne: '03',
					rv: 1,
				},
			},
			'cdm-zone-04': {
				defaultSizes: [[728, 90]],
				group: '04_BLB',
				bidderAlias: '04_BLB',
				targeting: {
					loc: 'middle',
					zne: '04',
					rv: 1,
				},
			},
			'cdm-zone-06': {
				defaultSizes: [[300, 250]],
				group: '06_FMR',
				bidderAlias: '06_FMR',
				targeting: {
					loc: 'footer',
					zne: '06',
					rv: 1,
				},
			},
			incontent_player: {
				disabled: true,
				autoplay: true,
				audio: false,
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				insertBeforeSelector: '#mw-content-text > .mw-parser-output > h2',
				insertBelowFirstViewport: true,
				targeting: {
					loc: 'middle',
					rv: 1,
				},
			},
		};
	}

	setupStates(): void {
		this.setState('cdm-zone-01', true);
		this.setState('cdm-zone-02', true);
		this.setState('cdm-zone-03', true);
		this.setState('cdm-zone-04', !context.get('state.isMobile'));
		this.setState('cdm-zone-06', true);
		this.setState('incontent_player', context.get('options.video.isOutstreamEnabled'));
	}

	setState(slotName: string, state: boolean): void {
		const element = document.getElementById(slotName);

		slotService.setState(slotName, !!element && state);
	}
}

export const slotsContext = new SlotsContext();
