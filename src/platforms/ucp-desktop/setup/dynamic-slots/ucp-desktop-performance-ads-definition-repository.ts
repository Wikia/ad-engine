import { context, targetingService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const POPULAR_PAGES_SELECTOR =
	'#recirculation-rail .rail-module__list .popular-pages__item a.sponsored-content';
const OTHERS_LIKE_YOU_SELECTOR =
	'.render-wiki-recommendations-right-rail .related-content-items-wrapper > a:first-of-type';
const logGroup = 'performance-ads';

type PerformanceAdsPositions = 'popularPages' | 'othersLikeYou' | 'othersLikeYouWide';

interface WidgetAdPayload {
	type?: PerformanceAdsPositions;
	data?: {
		impression: string;
		clickthrough: string;
		title: string;
		image: string;
		description?: string;
	};
}

@Injectable()
export class UcpDesktopPerformanceAdsDefinitionRepository {
	private widgetData: WidgetAdPayload = null;
	private popularPagesElement: HTMLElement;
	private othersLikeYouElement: HTMLElement;
	private taglessRequestParams = {
		adUnit: '/5441/wka1b.ICW/incontent_widget/',
		size: '1x1',
		targeting: {
			loc: 'middle',
			pos: 'incontent_widget',
			src: context.get('src'),
		},
	};

	async setup(): Promise<void> {
		if (!context.get('options.performanceAds')) {
			utils.logger(logGroup, 'Performance Ads disabled');
			return;
		}

		this.popularPagesElement = document.querySelector(POPULAR_PAGES_SELECTOR);
		this.taglessRequestParams.targeting = {
			...this.taglessRequestParams.targeting,
			...targetingService.dump(),
		};

		if (this.popularPagesElement) {
			await this.getDataFromAdServer('popularPages');
		}

		new utils.WaitFor(() => !!document.querySelector(OTHERS_LIKE_YOU_SELECTOR), 50, 0, 250)
			.until()
			.then(() => {
				this.othersLikeYouElement = document.querySelector(OTHERS_LIKE_YOU_SELECTOR);
				this.getDataFromAdServer('othersLikeYou');
			});
	}

	private async getDataFromAdServer(position: PerformanceAdsPositions): Promise<void> {
		if (!this.widgetData) {
			const taglessRequestUrl = utils.buildTaglessRequestUrl(this.taglessRequestParams);

			utils.logger(logGroup, 'Tagless Request URL built', taglessRequestUrl);

			await utils.scriptLoader.loadAsset(taglessRequestUrl, 'text').then((response) => {
				if (!response) {
					return;
				}

				try {
					this.widgetData = JSON.parse(response) || {};
					utils.logger(logGroup, 'Widget payload received', this.widgetData);
				} catch (e) {
					return;
				}
			});

			this.widgetData = this.widgetData || {};
		}

		if (!this.widgetData.type || !this.widgetData.type.includes(position)) {
			return;
		}

		switch (this.widgetData.type) {
			case 'popularPages':
				this.fillPopularPages();
				break;
			case 'othersLikeYou':
				this.fillOthersLikeYou();
				break;
			case 'othersLikeYouWide':
				this.fillOthersLikeYou(true);
				break;
			default:
				break;
		}

		return Promise.resolve();
	}

	private fillPopularPages() {
		utils.logger(logGroup, 'Filling popularPages');

		const image = this.popularPagesElement.querySelector('img');
		const title = this.popularPagesElement.querySelector('.sponsored-content__title');
		const description = this.popularPagesElement.querySelector('.sponsored-content__attribution');

		this.popularPagesElement.setAttribute('href', this.widgetData.data.clickthrough);
		this.popularPagesElement.setAttribute('title', this.widgetData.data.title);
		this.popularPagesElement.setAttribute('target', '_blank');

		image.setAttribute('src', this.widgetData.data.image);
		image.setAttribute('alt', this.widgetData.data.title);
		title.innerHTML = this.widgetData.data.title;
		description.innerHTML = this.widgetData.data.description || 'Sponsored';

		this.triggerImpressionPixels();
	}

	private fillOthersLikeYou(wide = false) {
		utils.logger(logGroup, 'Filling othersLikeYou');

		const image = this.othersLikeYouElement.querySelector(
			'div:not(.recommendations__article-title)',
		);
		const title = this.othersLikeYouElement.querySelector('.recommendations__article-title');

		this.othersLikeYouElement.setAttribute('href', this.widgetData.data.clickthrough);
		this.othersLikeYouElement.setAttribute('target', '_blank');
		this.othersLikeYouElement.classList.add('performance-ad');

		image.setAttribute('src', this.widgetData.data.image);
		image.setAttribute('style', `background-image: url(${this.widgetData.data.image});`);
		title.innerHTML = this.widgetData.data.title;

		if (wide) {
			this.othersLikeYouElement.setAttribute('style', 'width: 200px;');
			image.setAttribute(
				'style',
				`background-image: url(${this.widgetData.data.image}); width: 200px;`,
			);
		}

		this.triggerImpressionPixels();
	}

	private triggerImpressionPixels(): void {
		utils.scriptLoader.loadAsset(this.widgetData.data.impression, 'blob');
	}
}
