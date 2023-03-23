import { context, targetingService, utils } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

const POPULAR_PAGES_SELECTOR =
	'#recirculation-rail .rail-module__list .popular-pages__item a.sponsored-content';
const OTHERS_LIKE_YOU_SELECTOR =
	'.render-wiki-recommendations-right-rail .related-content-items-wrapper > a:first-of-type';
const logGroup = 'performance-ads';

type PerformanceAdType = 'popularPages' | 'othersLikeYou' | 'othersLikeYouWide';

interface WidgetAdPayload {
	type?: PerformanceAdType;
	data?: {
		impression: string;
		clickthrough: string;
		title: string;
		image: string;
		description?: string;
	};
}

@injectable()
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
			await this.getDataFromAdServer();
			this.fillPerformanceWidget('popularPages');
		}

		new utils.WaitFor(() => !!document.querySelector(OTHERS_LIKE_YOU_SELECTOR), 50, 0, 250)
			.until()
			.then(async () => {
				this.othersLikeYouElement = document.querySelector(OTHERS_LIKE_YOU_SELECTOR);

				if (this.othersLikeYouElement) {
					await this.getDataFromAdServer();
					this.fillPerformanceWidget('othersLikeYou');
				}
			});
	}

	private async getDataFromAdServer(): Promise<void> {
		if (this.widgetData) {
			return Promise.resolve();
		}

		const taglessRequestUrl = utils.buildTaglessRequestUrl(this.taglessRequestParams);

		utils.logger(logGroup, 'Tagless Request URL built', taglessRequestUrl);

		await utils.scriptLoader.loadAsset(taglessRequestUrl, 'text').then((response) => {
			if (!response) {
				this.widgetData = {};
				return;
			}

			try {
				this.widgetData = JSON.parse(response) || {};
				utils.logger(logGroup, 'Widget payload received', this.widgetData);
			} catch (e) {
				this.widgetData = {};
				return;
			}
		});

		this.widgetData = this.widgetData || {};

		return Promise.resolve();
	}

	private fillPerformanceWidget(type: PerformanceAdType) {
		if (!this.widgetData.type || !this.widgetData.type.includes(type)) {
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
			this.othersLikeYouElement.nextSibling?.remove();
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
