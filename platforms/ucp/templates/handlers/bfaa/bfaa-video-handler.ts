import {
	AdSlot,
	DomManipulator,
	Porvata,
	Porvata4Player,
	PorvataTemplateParams,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { TimeoutManager } from '../../helpers/timeout-manager';
import { VideoHelper } from '../../helpers/video-helper';
import { UapContext } from '../uap-context';

@Injectable()
export class BfaaVideoHandler implements TemplateStateHandler {
	private helper: VideoHelper;
	private manipulator: DomManipulator = new DomManipulator();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.CONTEXT) private context: UapContext,
		private timeoutManager: TimeoutManager,
	) {
		this.helper = new VideoHelper(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		if (!universalAdPackage.isVideoEnabled(this.params)) {
			return;
		}

		const playerParams: PorvataTemplateParams = this.helper.getPlayerParams();

		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.context.video = utils.createExtendedPromise<Porvata4Player>();
		this.helper.setCtpTargeting();

		Porvata.inject(playerParams).then((video) => {
			this.context.video.resolve(video);
			this.helper.handleRestart(video, transition);
			this.helper.handleEvents(video);
			this.helper.adjustUI(video, playerParams.container, playerParams);
			this.handleCtpStart(video, playerParams, transition);
		});
	}

	private handleCtpStart(
		video: Porvata4Player,
		params: PorvataTemplateParams,
		transition: TemplateTransition,
	): void {
		if (!params.autoPlay) {
			fromEvent(video, 'wikiaAdStarted')
				.pipe(
					take(1),
					tap(() => {
						this.timeoutManager.start(universalAdPackage.BFAA_UNSTICK_DELAY);
						transition('impact', { allowMulticast: true });
					}),
				)
				.subscribe();
		}
	}

	async onLeave(): Promise<void> {}
}
