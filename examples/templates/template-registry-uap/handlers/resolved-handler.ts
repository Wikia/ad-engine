import {
	AdSlot,
	Dictionary,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { CSS_CLASSNAME_THEME_RESOLVED } from '../../../../src/ad-products/templates/uap/constants';
import { createScrollObservable } from '../../../../src/ad-products/templates/uap/themes/hivi/hivi-bfaa-2';
import { HandlersShared } from '../helpers/handlers-shared';

@Injectable()
export class ResolvedHandler implements TemplateStateHandler {
	unsubscribe$ = new Subject();

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: Dictionary,
		@Inject(TEMPLATE.SLOT) private slot: AdSlot,
		private shared: HandlersShared,
	) {}

	async onEnter(transition: TemplateTransition<'sticky' | 'impact'>): Promise<void> {
		console.log('resolved', this.params);
		slotTweaker.setPaddingBottom(this.shared.readyElement, this.params.config.aspectRatio.resolved);
		this.shared.ui.switchImagesInAd(this.params as any, true);
		this.slot.addClass(CSS_CLASSNAME_THEME_RESOLVED);

		this.shared.updateAdSizes();

		this.shared.config.moveNavbar(0, 0);
		this.shared.ui.setBodyPaddingTop(`${this.shared.aspectRatio.resolved}%`);

		// Stick on scroll only if not viewable and not timeout
		this.shared.viewableAndTimeoutRunning$
			.pipe(
				filter((running) => !!running),
				switchMap(() => {
					return createScrollObservable().pipe(
						takeUntil(this.shared.viewableAndTimeoutRunning$.pipe(filter((running) => !running))),
						takeUntil(this.unsubscribe$),
					);
				}),
			)
			.subscribe(() => transition('sticky'));
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
