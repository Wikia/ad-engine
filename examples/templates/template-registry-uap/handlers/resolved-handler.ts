import {
	createScrollObservable,
	CSS_CLASSNAME_THEME_RESOLVED,
	slotTweaker,
	TemplateAdSlot,
	TemplateParams,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { HandlersShared } from '../helpers/handlers-shared';

@Injectable()
export class ResolvedHandler implements TemplateStateHandler {
	unsubscribe$ = new Subject();

	constructor(
		private params: TemplateParams,
		private slot: TemplateAdSlot,
		private shared: HandlersShared,
	) {}

	async onEnter(transition: TemplateTransition<'sticky' | 'impact'>): Promise<void> {
		console.log('resolved', this.params);
		slotTweaker.setPaddingBottom(this.shared.readyElement, this.params.config.aspectRatio.resolved);
		this.shared.ui.switchImagesInAd(this.params as any, true);
		this.slot.addClass(CSS_CLASSNAME_THEME_RESOLVED);

		this.shared.updateAdSizes();

		this.shared.config.moveNavbar(0, 0);

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

	async onLeave(): Promise<void> {}
}
