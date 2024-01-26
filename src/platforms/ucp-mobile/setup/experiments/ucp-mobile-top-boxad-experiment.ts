import {
	context,
	InsertMethodType,
	InstantConfigService,
	OpenWeb,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileTopBoxadParagraphHelper } from './utils/ucp-mobile-top-boxad-paragraph-helper';

interface TopBoxadConfigExperiment {
	anchorSelector: string;
	insertMethod: InsertMethodType;
}

const logGroup = 'UcpMobileTopBoxadExperiment';

@Injectable()
export class UcpMobileTopBoxadExperiment {
	private defaultAnchorSelector = context.get('templates.incontentAnchorSelector');
	private defaultNonHomeConfig: TopBoxadConfigExperiment = {
		anchorSelector: this.defaultAnchorSelector,
		insertMethod: 'before',
	};
	private defaultHomeConfig: TopBoxadConfigExperiment = {
		anchorSelector: '.mobile-main-page__wiki-description',
		insertMethod: 'after',
	};

	constructor(
		private instantConfig: InstantConfigService,
		private openWeb: OpenWeb,
		private paragraphHelper: UcpMobileTopBoxadParagraphHelper,
	) {}

	public getConfig(): TopBoxadConfigExperiment {
		if (this.isExperimentEnabled() && !this.isHome()) {
			utils.logger(logGroup, 'New topbox_ad config');
			return this.getExperimentConfig();
		}

		utils.logger(logGroup, this.isHome() ? 'Home page' : 'Default config');
		this.addToTargeting('top_boxad_default');
		return this.isHome() ? this.defaultHomeConfig : this.defaultNonHomeConfig;
	}

	private getExperimentConfig(): TopBoxadConfigExperiment {
		const paragraphSelector = this.paragraphHelper.getParagraphSelector();
		const paragraphs = Array.from(document.querySelectorAll(paragraphSelector));
		const firstParagraph = this.paragraphHelper.getFirstParagraph(paragraphs);

		if (!this.paragraphHelper.existParagraph(firstParagraph)) {
			utils.logger(logGroup, 'First paragraph does not exist');
			this.addToTargeting('top_boxad_default');
			return this.defaultNonHomeConfig;
		}

		if (this.isBeforeFirstH2(firstParagraph.element)) {
			return this.getBeforeFirstH2Config(firstParagraph);
		}

		if (this.paragraphHelper.isLargeParagraph(firstParagraph.element)) {
			return this.getLargeParagraphConfig(firstParagraph);
		}

		const secondParagraph = this.paragraphHelper.getSecondParagraph(
			paragraphs,
			firstParagraph.nthOfType,
		);

		if (this.paragraphHelper.existParagraph(secondParagraph)) {
			return this.getSecondParagraphConfig(secondParagraph);
		}

		this.addToTargeting('top_boxad_default');
		return this.defaultNonHomeConfig;
	}

	private getSecondParagraphConfig(secondParagraph: { element: Element; nthOfType: number }) {
		utils.logger(logGroup, 'Short first <p>, ad after second <p>');
		this.addToTargeting('top_boxad_second_paragraph');

		return this.prepareConfig(
			`${this.paragraphHelper.getNthParagraphSelector(secondParagraph.nthOfType)}, ${
				this.defaultAnchorSelector
			}`,
			'after',
		);
	}

	private getLargeParagraphConfig(firstParagraph: { element: Element; nthOfType: number }) {
		utils.logger(logGroup, 'Large first <p>');
		this.addToTargeting('top_boxad_large_paragraph');

		return this.prepareConfig(
			`${this.paragraphHelper.getNthParagraphSelector(firstParagraph.nthOfType)}, ${
				this.defaultAnchorSelector
			}`,
			'after',
		);
	}

	private getBeforeFirstH2Config(firstParagraph: { element: Element; nthOfType: number }) {
		utils.logger(logGroup, 'One <p> before <h2>');
		this.addToTargeting('top_boxad_one_paragraph');

		return this.prepareConfig(
			`${this.paragraphHelper.getNthParagraphSelector(firstParagraph.nthOfType)}, ${
				this.defaultAnchorSelector
			}`,
			'after',
		);
	}

	private addToTargeting(experimentGroup: string) {
		const targetingData = targetingService.get('experiment_groups') || [];
		targetingData.push(experimentGroup);

		targetingService.set('experiment_groups', targetingData);
	}

	private prepareConfig(
		anchorSelector: string,
		insertMethod: InsertMethodType,
	): TopBoxadConfigExperiment {
		return {
			anchorSelector: anchorSelector,
			insertMethod: insertMethod,
		};
	}

	private isExperimentEnabled() {
		if (this.openWeb.isActive()) {
			utils.logger(logGroup, 'OpenWeb is on');

			return false;
		}

		return this.instantConfig.get('icExperiments', []).includes('topBoxadNewLogic');
	}

	private isHome() {
		return context.get('wiki.targeting.pageType') === 'home';
	}

	private isBeforeFirstH2(element: Element) {
		const firstH2 = document.querySelector('.mw-parser-output > h2');

		if (element.nextElementSibling == firstH2) {
			return true;
		}

		const tocElement = document.querySelector('.mw-parser-output > #toc');

		return element.nextElementSibling == tocElement && tocElement.nextElementSibling == firstH2;
	}
}
