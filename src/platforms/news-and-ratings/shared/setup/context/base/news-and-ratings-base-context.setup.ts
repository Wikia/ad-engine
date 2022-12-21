import { context, DiProcess, utils } from '@wikia/ad-engine';

export class NewsAndRatingsBaseContextSetup implements DiProcess {
	execute(): void {
		context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441);
		context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src'));
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}
}
