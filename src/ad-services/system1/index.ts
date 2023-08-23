import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, localCache, utils } from '@ad-engine/core';

const logGroup = 'system1';
const scriptUrl = '//s.flocdn.com/@s1/embedded-search/embedded-search.js';
const partnerId = '42232';
const segments = {
	mobile: 'fanmob00',
	desktop: 'fan00',
	darkTheme: 'fandomdark',
};
const themes = {
	dark: 'dark',
	light: 'light',
};

const cacheKey = 'adEngine_system1';
const cacheTtl = 86400; // 24 * 3600;

export class System1 extends BaseServiceSetup {
	private isLoaded = false;

	call(): Promise<void> {
		if (!this.isSearchPage()) {
			utils.logger(logGroup, 'disabled - it is not search page');
			return Promise.resolve();
		}

		if (!this.isEnabled('icSystem1', false)) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		const oldLogicBundleName = 'old_incontent_ads';
		const includedInSpecificCommunitiesList =
			window.fandomContext?.site?.tags?.bundles?.includes(oldLogicBundleName);

		if (includedInSpecificCommunitiesList) {
			utils.logger(logGroup, 'on this wiki system1 is disabled');
			return Promise.resolve();
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading...');
			this.isLoaded = true;
			return utils.scriptLoader.loadScript(scriptUrl).then(() => {
				utils.logger(logGroup, 'asset loaded');
				this.setup();
			});
		}
	}

	private setup(): void {
		window.s1search =
			window.s1search ||
			((...args: any) => {
				(window.s1search.q = window.s1search.q || []).push(args);
			});

		const config = this.getConfig();
		utils.logger(logGroup, 'Config', config);

		window.s1search('config', config);
	}

	private getConfig(): object {
		return {
			category: this.getCategory(),
			domain: this.getHostname(),
			isTest: false,
			newSession: this.isThemeChanged(),
			onComplete: this.onSetupResolve,
			onError: this.onSetupRejected,
			partnerId: partnerId,
			segment: this.getSegment(),
			signature: this.getSearchSignature(),
			subId: this.getSubId(),
			query: this.getSearchQuery(),
		};
	}

	private getCategory(): string {
		const searchFilter = context.get('wiki.search_filter') || '';

		switch (searchFilter) {
			case 'videoOnly':
				return 'video';
			case 'imageOnly':
				return 'image';
			default:
				return 'web';
		}
	}

	private getSubId(): string {
		const formattedUrl = `${window.location.protocol}//${this.getHostname()}`;
		const firstSubdomain = this.getHostname().split('.')[0];

		return `${formattedUrl}?serp=${this.getSearchQuery()}&segment=${this.getSegment()}&domain=${firstSubdomain}`;
	}

	private getHostname() {
		return window.location.hostname.toLowerCase();
	}

	private getSegment(): string {
		if (this.getTheme() === themes.dark) {
			return segments.darkTheme;
		}

		return context.get('state.isMobile') ? segments.mobile : segments.desktop;
	}

	private getSearchQuery(): string {
		return context.get('wiki.search_term_for_html') || '';
	}

	private getSearchSignature(): string {
		return context.get('wiki.search_system1_signature') || '';
	}

	private isSearchPage(): boolean {
		const pageType = context.get('wiki.opts.pageType') || '';
		return pageType == 'search';
	}

	private getTheme(): string {
		return (window.mw as any)?.config?.get('isDarkTheme') ? themes.dark : themes.light;
	}

	private isThemeChanged() {
		const cacheValue = localCache.getItem(cacheKey);

		if (!cacheValue || cacheValue !== this.getTheme()) {
			localCache.setItem(cacheKey, this.getTheme(), cacheTtl);
			utils.logger(logGroup, 'Theme changed');
			return true;
		}

		return false;
	}

	private onSetupResolve(): void {
		utils.logger(logGroup, 'completed');
		communicationService.emit(eventsRepository.SYSTEM1_STARTED);
	}

	private onSetupRejected(message: string): void {
		utils.logger(logGroup, 'Error: ' + message);
		communicationService.emit(eventsRepository.SYSTEM1_FAILED);
	}
}
