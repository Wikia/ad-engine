import { context, utils } from '@wikia/ad-engine';

export class NewsAndRatingsPageDataGetter {
	getPagePath(): string {
		const dataWithPagePath = this.getDataSettingsFromMetaTag();
		const pagePath = dataWithPagePath?.unit_name
			? this.getPagePathFromMetaTagData(dataWithPagePath)
			: this.getPagePathFromUtagData();

		if (!pagePath) {
			return '';
		}

		return pagePath[0] === '/' ? pagePath : '/' + pagePath;
	}

	getDataSettingsFromMetaTag() {
		const adSettingsJson = document.getElementById('ad-settings')?.getAttribute('data-settings');
		utils.logger('Ad settings: ', adSettingsJson);

		if (!adSettingsJson) {
			return null;
		}

		try {
			return JSON.parse(adSettingsJson);
		} catch (e) {
			utils.logger('Could not parse JSON');
			return null;
		}
	}

	getPagePathFromMetaTagData(dataWithPagePath) {
		const adUnitPropertyPart = context.get('custom.property');
		const propertyIndex = dataWithPagePath?.unit_name?.indexOf(adUnitPropertyPart);
		const slicedUnitName = dataWithPagePath?.unit_name?.slice(propertyIndex);

		return slicedUnitName.replace(adUnitPropertyPart, '');
	}

	getPagePathFromUtagData() {
		const dataWithPagePath = this.getUtagData();
		return dataWithPagePath?.siteSection;
	}

	getUtagData() {
		const utagData = window.utag_data;
		utils.logger('utag data: ', utagData);
		return utagData;
	}
}
