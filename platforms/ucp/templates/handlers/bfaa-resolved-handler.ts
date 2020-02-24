import {
	AdSlot,
	DomManipulator,
	NAVBAR,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { BfaaHelper } from '../helpers/bfaa-helper';

@Injectable()
export class BfaaResolvedHandler implements TemplateStateHandler {
	private manipulator = new DomManipulator();
	private helper: BfaaHelper;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(NAVBAR) navbar: HTMLElement,
	) {
		this.helper = new BfaaHelper(this.manipulator, this.params, this.adSlot, navbar);
	}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.adSlot.show();
		this.helper.setResolvedImage();
		this.helper.setResolvedAdHeight();
	}

	async onLeave(): Promise<void> {
		this.manipulator.restore();
	}
}
