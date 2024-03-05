import {
	context,
	defineExperiment,
	Experiment,
	getExperiment,
	InsertMethodType,
	InstantConfigService,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileTopBoxadParagraphHelper } from './utils/ucp-mobile-top-boxad-paragraph-helper';

interface TopBoxadConfigExperiment {
	anchorSelector: string;
	insertMethod: InsertMethodType;
}

type RunningExperimentType = Experiment | null | undefined;

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

	private pathfinderExperimentVariantNames = {
		control: 'top-boxad-paragraphs-mobile-experiment-control',
		active: 'top-boxad-paragraphs-mobile-experiment-active',
	};

	private pathfinderExperimentVariants = [
		defineExperiment({
			name: this.pathfinderExperimentVariantNames.active,
			buckets: ['k', 'l'],
		}),
		defineExperiment({
			name: this.pathfinderExperimentVariantNames.control,
			buckets: ['i', 'j', 'u', 'v'],
		}),
	];

	private pathfinderActiveExperimentVariant: RunningExperimentType = getExperiment(
		this.pathfinderExperimentVariants,
	);

	constructor(
		private instantConfig: InstantConfigService,
		private paragraphHelper: UcpMobileTopBoxadParagraphHelper,
	) {}

	public getConfig(): TopBoxadConfigExperiment {
		if (this.isExperimentEnabled()) {
			utils.logger(logGroup, 'New topbox_ad config');
			return this.getExperimentConfig();
		}

		utils.logger(logGroup, this.isHome() ? 'Home page' : 'Default config');
		return this.isHome() ? this.defaultHomeConfig : this.defaultNonHomeConfig;
	}

	private getExperimentConfig(): TopBoxadConfigExperiment {
		if (this.isPathfinderControlVariant()) {
			utils.logger(logGroup, 'Experiment but control group');
			this.addToTargeting(this.pathfinderExperimentVariantNames.control);
			return this.defaultNonHomeConfig;
		}

		this.addToTargeting(this.pathfinderExperimentVariantNames.active);

		const paragraphSelector = this.paragraphHelper.getParagraphSelector();
		const paragraphs = Array.from(document.querySelectorAll(paragraphSelector));
		const firstParagraph = this.paragraphHelper.getFirstParagraph(paragraphs);

		if (!this.paragraphHelper.existParagraph(firstParagraph)) {
			utils.logger(logGroup, 'First paragraph does not exist');
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

		return this.defaultNonHomeConfig;
	}

	private getSecondParagraphConfig(secondParagraph: { element: Element; nthOfType: number }) {
		utils.logger(logGroup, 'Short first <p>, ad after second <p>');

		return this.prepareConfig(
			`${this.paragraphHelper.getNthParagraphSelector(secondParagraph.nthOfType)}, ${
				this.defaultAnchorSelector
			}`,
			'after',
		);
	}

	private getLargeParagraphConfig(firstParagraph: { element: Element; nthOfType: number }) {
		utils.logger(logGroup, 'Large first <p>');

		return this.prepareConfig(
			`${this.paragraphHelper.getNthParagraphSelector(firstParagraph.nthOfType)}, ${
				this.defaultAnchorSelector
			}`,
			'after',
		);
	}

	private getBeforeFirstH2Config(firstParagraph: { element: Element; nthOfType: number }) {
		utils.logger(logGroup, 'One <p> before <h2>');

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
		return (
			this.instantConfig.get('icExperiments', []).includes('topBoxadNewLogic') &&
			!this.isHome() &&
			this.pathfinderActiveExperimentVariant
		);
	}

	private isHome() {
		return window.ads.context?.targeting?.pageType === 'home';
	}

	private isBeforeFirstH2(element: Element) {
		const firstH2 = document.querySelector('.mw-parser-output > h2');

		if (element.nextElementSibling == firstH2) {
			return true;
		}

		const tocElement = document.querySelector('.mw-parser-output > #toc');

		return element.nextElementSibling == tocElement && tocElement.nextElementSibling == firstH2;
	}

	private isPathfinderControlVariant() {
		return (
			this.pathfinderActiveExperimentVariant?.name === this.pathfinderExperimentVariantNames.control
		);
	}
}
