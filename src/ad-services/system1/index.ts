import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { getDomain } from '../../platforms/shared';

const logGroup = 'system1';
const scriptUrl = 'https://s.flocdn.com/@s1/embedded-search/embedded-search.js';
const partnerId = 1;
const segment = '';

export class System1 extends BaseServiceSetup {
	private isLoaded = false;

	call(): Promise<void> {
		if (!this.isEnabled('icSystem1')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		if (!this.isSearchPage()) {
			utils.logger(logGroup, 'disabled - it is not search page');
			return Promise.resolve();
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading...');
			this.isLoaded = true;
			return utils.scriptLoader.loadScript(scriptUrl, 'text/javascript', true, 'first').then(() => {
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
		utils.logger(logGroup, config);

		window.s1search('config', config);
	}

	private getConfig(): object {
		return {
			category: this.getCategory(),
			domain: getDomain(),
			partnerId: partnerId,
			isTest: true,
			onComplete: this.onSetupResolve,
			onError: this.onSetupRejected,
			query: this.getSearchQuery(),
			segment: segment,
			signature: this.getSearchSignature(),
		};
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

	private getCategory(): string {
		const filter = context.get('wiki.search_filter') || '';

		switch (filter) {
			case 'videoOnly':
				return 'video';
			case 'imageOnly':
				return 'image';
			default:
				return 'web';
		}
	}

	private onSetupResolve(): void {
		utils.logger(logGroup, 'completed');
		communicationService.emit(eventsRepository.SYSTEM1_LOADER);
	}

	private onSetupRejected(message: string): void {
		utils.logger(logGroup, 'Error: ' + message);
		communicationService.emit(eventsRepository.SYSTEM1_FAILED);
	}
}
