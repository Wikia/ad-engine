import {
	context,
	InsertMethodType,
	InstantConfigService,
	OpenWeb,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

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

	constructor(private instantConfig: InstantConfigService, private openWeb: OpenWeb) {}

	public getConfig(): TopBoxadConfigExperiment {
		if (this.isHome()) {
			utils.logger(logGroup, 'Home page');
			this.addToTargeting('top_boxad_default');

			return this.defaultHomeConfig;
		} else if (this.isExperimentEnabled()) {
			return this.getExperimentConfig();
		}

		utils.logger(logGroup, 'Default config');
		this.addToTargeting('top_boxad_default');
		return this.defaultNonHomeConfig;
	}

	private getExperimentConfig(): TopBoxadConfigExperiment {
		const paragraphs = Array.from(document.querySelectorAll('.mw-parser-output > p'));
		const firstParagraph = this.getFirstParagraph(paragraphs);

		if (!this.existParagraph(firstParagraph)) {
			utils.logger(logGroup, 'First paragraph does not exist');
			this.addToTargeting('top_boxad_default');

			return this.defaultNonHomeConfig;
		} else if (this.isBeforeFirstH2(firstParagraph.element)) {
			utils.logger(logGroup, 'One <p> before <h2>');
			this.addToTargeting('top_boxad_one_paragraph');

			return this.prepareConfig(
				`${this.getParagraphSelector(firstParagraph.nthOfType)}, ${this.defaultAnchorSelector}`,
				'after',
			);
		}

		if (this.isLargeParagraph(firstParagraph.element)) {
			utils.logger(logGroup, 'Large first <p>');
			this.addToTargeting('top_boxad_large_paragraph');

			return this.prepareConfig(
				`${this.getParagraphSelector(firstParagraph.nthOfType)}, ${this.defaultAnchorSelector}`,
				'after',
			);
		} else {
			const secondParagraph = this.getSecondParagraph(paragraphs, firstParagraph.nthOfType);

			if (this.existParagraph(secondParagraph)) {
				utils.logger(logGroup, 'Short first <p>, ad after second <p>');
				this.addToTargeting('top_boxad_second_paragraph');

				return this.prepareConfig(
					`${this.getParagraphSelector(secondParagraph.nthOfType)}, ${this.defaultAnchorSelector}`,
					'after',
				);
			}
		}

		this.addToTargeting('top_boxad_default');

		return this.defaultNonHomeConfig;
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

	private getParagraphSelector(nthOfType) {
		return `.mw-parser-output > p:nth-of-type(${nthOfType})`;
	}

	private isBeforeFirstH2(element: Element) {
		const firstH2 = document.querySelector('.mw-parser-output > h2');

		if (element.nextElementSibling == firstH2) {
			return true;
		}

		const tocElement = document.querySelector('.mw-parser-output > #toc');

		return element.nextElementSibling == tocElement && tocElement.nextElementSibling == firstH2;
	}

	private getParagraphData(
		paragraphs: Element[],
		condition: (element: Element, index: number) => boolean,
	) {
		const index = paragraphs.findIndex(condition);

		return {
			element:
				index >= 0 ? document.querySelector(this.getParagraphSelector(index + 1)) : undefined,
			nthOfType: index >= 0 ? index + 1 : undefined,
		};
	}

	private getFirstParagraph(paragraphs: Element[]) {
		return this.getParagraphData(paragraphs, (element) => element.textContent.trim() !== '');
	}

	private getSecondParagraph(paragraphs: Element[], firstOfTypeIndex: number) {
		return this.getParagraphData(
			paragraphs,
			(element, index) => element.textContent.trim() !== '' && index !== firstOfTypeIndex - 1,
		);
	}

	private isLargeParagraph(paragraph: Element) {
		return (
			paragraph.textContent &&
			(paragraph.textContent.length >= 400 || paragraph.clientHeight >= 350)
		);
	}

	private existParagraph(paragraph: { element: any; nthOfType: any }) {
		return paragraph.element && paragraph.nthOfType;
	}
}
