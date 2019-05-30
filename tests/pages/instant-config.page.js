class InstantConfig {
	constructor() {
		this.pageLink = 'services/instant-config/';
		this.configPlaceholder = '#config-placeholder';
		this.testQueryParamsButton = '#test-params';
		this.breakConfigButton = '#break-config';
	}

	enableTestQueryParams() {
		$(this.testQueryParamsButton).click();
	}

	enableBrokenConfigRequest() {
		$(this.breakConfigButton).click();
	}

	getConfig() {
		return browser.execute('return window.exposedInstantConfig');
	}
}

export const instantConfig = new InstantConfig();
