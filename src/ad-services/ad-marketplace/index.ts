import { communicationService, eventsRepository, ofType } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { map } from 'rxjs/operators';

interface AdMarketplaceConfiguration {
	enabled: boolean;
	insertSelector: string;
	insertMethod: string;
}

interface InstantSearchResponse {
	original_qt: string;
	paid_suggestions: {
		id: number;
		term: string;
		click_url: string;
		image_url: string;
		impression_url: string;
		label_required: boolean;
		brand: boolean;
		brand_domain: string;
	}[];
	organic_suggestions?: {
		term: string;
		paid_suggestion_ids?: number;
	}[];
}

const logGroup = 'ad-marketplace';

const instantSearchEndpoint = '//fandomcps.cps.ampfeed.com/suggestions?';
const instantSearchEndpointParameters = [
	'partner=fandomcps',
	'sub2=fandom.com',
	'v=1.4',
	'out=json',
	'results-ps=1',
	'results-os=0',
];

class AdMarketplace {
	private configuration: AdMarketplaceConfiguration;
	private fallbackConfiguration: AdMarketplaceConfiguration;
	private instantSearchSuggestionElement: HTMLElement | null = null;

	initialize(): Promise<void> {
		this.configuration = context.get('services.adMarketplace');

		if (
			!this.configuration.enabled ||
			context.get('wiki.opts.disableSearchAds') ||
			context.get('state.isLogged')
		) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		// TODO: Remove with references after SITE-2038 is completed
		this.fallbackConfiguration = {
			enabled: true,
			insertSelector: '.wds-global-navigation__search-suggestions.wds-dropdown__content',
			insertMethod: 'prepend',
		};

		instantSearchEndpointParameters.push(
			`sub1=${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		);
		instantSearchEndpointParameters.push('qt=');

		communicationService.on(eventsRepository.ADMARKETPLACE_INIT, () => {
			this.registerSearchEvents();
		});

		return Promise.resolve();
	}

	private registerSearchEvents(): void {
		communicationService.action$
			.pipe(
				ofType(communicationService.getGlobalAction(eventsRepository.ADMARKETPLACE_CALLED)),
				map(({ query }) => {
					return query;
				}),
			)
			.subscribe(async (query) => {
				utils.logger(logGroup, 'called');

				this.requestInstantSearchAds(query);
			});
	}

	private requestInstantSearchAds(query: string): Promise<void> {
		const endpoint = instantSearchEndpoint + instantSearchEndpointParameters.join('&') + query;

		return fetch(endpoint)
			.then(
				(response: Response) => {
					if (response.status === 200) {
						utils.logger(logGroup, 'successful API response');
						return response.json();
					}
					utils.logger(logGroup, `API response status: ${response.status}`);
					return {};
				},
				() => {
					utils.logger(logGroup, 'call rejected');
					return {};
				},
			)
			.then((response: InstantSearchResponse) => {
				utils.logger(logGroup, 'instant search responded', response);

				this.handleInstantSearchAdsResponse(response);
			});
	}

	private handleInstantSearchAdsResponse(response: InstantSearchResponse): void {
		if (!response || !response.paid_suggestions || !response.paid_suggestions[0]) {
			return;
		}

		const configuration =
			this.getElement(this.configuration.insertSelector) !== null
				? this.configuration
				: this.fallbackConfiguration;
		const wrapper = this.getInstantSearchAdsWrapper(configuration);

		if (!wrapper) {
			return;
		}

		utils.logger(logGroup, 'Injecting the instant search ad');
		wrapper.innerHTML = this.getInstantSearchAdsContent(
			response.paid_suggestions[0].brand_domain || response.paid_suggestions[0].term,
			response.paid_suggestions[0].click_url,
			response.paid_suggestions[0].image_url,
			response.paid_suggestions[0].impression_url,
		);
	}

	private getElement(selector: string) {
		const element = document.querySelector(selector);

		if (!element) {
			return null;
		}

		return element;
	}

	private getInstantSearchAdsWrapper(
		configuration: AdMarketplaceConfiguration,
	): HTMLElement | null {
		if (!this.instantSearchSuggestionElement || !this.instantSearchSuggestionElement.isConnected) {
			const dropdownElementSelector = configuration.insertSelector;
			const dropdownElement = this.getElement(dropdownElementSelector);

			if (!dropdownElement) {
				utils.logger(logGroup, `No dropdownElement found, selector: ${dropdownElementSelector}`);
				return null;
			}

			const suggestionElement = document.createElement('p');
			suggestionElement.className = 'instant-suggestion';

			if (configuration.insertMethod === 'prepend') {
				dropdownElement.prepend(suggestionElement);
			} else if (configuration.insertMethod === 'after') {
				dropdownElement.after(suggestionElement);
			}

			this.instantSearchSuggestionElement = suggestionElement;
		} else {
			utils.logger(logGroup, 'No instantSearchSuggestionElement');
		}

		return this.instantSearchSuggestionElement;
	}

	private getInstantSearchAdsContent(
		title: string,
		url: string,
		image: string,
		impression: string,
	): string {
		return `<a href="${url}" target="_blank">
    			<img class="logo" src="${image}" alt="" />
    			<span class="title">${title}</span><span class="label">Sponsored</span>
    			<img class="pixel" src="${impression}" alt="" width="1" height="1" />
  			</a>`;
	}
}

export const adMarketplace = new AdMarketplace();
