import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, globalContextService, localCache } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { isCoppaSubject, logger, scriptLoader } from '@ad-engine/utils';

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

const blockedBotUserAgents = [
	'(former https://www.admantx.com + https://integralads.com/about-ias/)',
	'(https://gumgum.com/verity; verity-support@gumgum.com',
	'peer39_crawler/1.0',
];

const excludedBundleTags = ['sensitive', 'disabled_search_ads'];

export class System1 extends BaseServiceSetup {
	private isLoaded = false;

	call(): Promise<void> {
		if (!this.isSearchPage()) {
			logger(logGroup, 'disabled - it is not search page');
			return Promise.resolve();
		}

		if (!this.isEnabled()) {
			logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		if (!this.isLoaded) {
			logger(logGroup, 'loading...');
			this.isLoaded = true;
			return scriptLoader.loadScript(scriptUrl).then(() => {
				logger(logGroup, 'asset loaded');
				this.setup();
			});
		}
	}

	isEnabled(): boolean {
		return (
			super.isEnabled('icSystem1', false) &&
			!isCoppaSubject() &&
			!this.isBot() &&
			!this.isExcludedByBundleTag()
		);
	}

	private setup(): void {
		window.s1search =
			window.s1search ||
			((...args: any) => {
				(window.s1search.q = window.s1search.q || []).push(args);
			});

		const config = this.getConfig();
		logger(logGroup, 'Config', config);

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
			logger(logGroup, 'Theme changed');
			return true;
		}

		return false;
	}

	private onSetupResolve(): void {
		logger(logGroup, 'completed');
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, { status: 'system1_loaded' });
	}

	private onSetupRejected(message: string): void {
		logger(logGroup, 'Error: ' + message);
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, { status: 'system1_failed' });
	}

	private isBot(): boolean {
		const { userAgent } = window.navigator;

		return blockedBotUserAgents.some((botUserAgent) => userAgent.includes(botUserAgent));
	}

	private isExcludedByBundleTag(): boolean {
		for (const excludedBundleTagName of excludedBundleTags) {
			const communityExcludedByTag = globalContextService.hasBundle(excludedBundleTagName);

			if (communityExcludedByTag) {
				logger(logGroup, `community excluded by tag bundle=${excludedBundleTagName}`);
				return true;
			}
		}

		return false;
	}
}
