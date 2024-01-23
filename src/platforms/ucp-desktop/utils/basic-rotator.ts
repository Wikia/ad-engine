import {
	AdSlot,
	AdSlotStatus,
	communicationService,
	context,
	eventsRepository,
	scrollListener,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';

interface RotatorConfig {
	topPositionToRun: number;
}

export class BasicRotator {
	private logGroup = 'basic-rotator';

	private rotatorListener: string;
	private slotContainer: HTMLElement;
	private refreshInfo = {
		recSlotViewed: 2000,
		refreshDelay: utils.queryString.isUrlParamSet('fmr-debug') ? 2000 : 10000,
		startPosition: 0,
		positionTopToViewport: undefined,
		repeatIndex: 1,
		repeatLimit: 20,
		refreshInterval: 30000,
	};
	private currentSlotName = '';

	constructor(
		private slotName: string,
		private slotNamePrefix: string,
		private config: RotatorConfig,
	) {
		this.slotContainer = document.querySelector(`#${this.slotName}`);
		utils.logger(this.logGroup, 'initialized');
	}

	rotateSlot(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				if (slot.getSlotName().substring(0, this.slotNamePrefix.length) !== this.slotNamePrefix) {
					return;
				}

				if (universalAdPackage.isFanTakeoverLoaded()) {
					utils.logger(this.logGroup, 'fan takeover loaded ', 'rotator stopped');
					return;
				}

				communicationService.onSlotEvent(
					AdSlotStatus.STATUS_SUCCESS,
					() => {
						utils.logger(this.logGroup, 'success detected', slot.getSlotName());
						this.rotationCallbackAction(slot);
					},
					slot.getSlotName(),
					true,
				);
				communicationService.onSlotEvent(
					AdSlotStatus.STATUS_COLLAPSE,
					() => {
						utils.logger(this.logGroup, 'collapse detected', slot.getSlotName());
						this.rotationCallbackAction(slot);
					},
					slot.getSlotName(),
					true,
				);
			},
			false,
		);

		this.startFirstRotation();
	}

	private rotationCallbackAction(slot: AdSlot): void {
		if (this.currentSlotName === slot.getSlotName()) {
			return;
		}

		if (this.isRotationFinished()) {
			utils.logger(this.logGroup, 'rotation finished');
			return;
		}

		utils.logger(
			this.logGroup,
			'rotation scheduled',
			`${this.slotNamePrefix}${this.refreshInfo.repeatIndex}`,
		);
		this.currentSlotName = slot.getSlotName();
		setTimeout(() => {
			slot.destroy();
			slot.getElement().remove();
			this.pushNextSlot();
		}, this.refreshInfo.refreshInterval);
	}

	private startFirstRotation(): void {
		this.runNowOrOnScroll(
			() => this.isInViewport() && this.isCorrectPositionReached(),
			this.pushNextSlot.bind(this),
		);
	}

	private runNowOrOnScroll(condition, callback): void {
		if (condition()) {
			this.removeScrollListener();
			callback();
		} else if (!this.rotatorListener) {
			this.rotatorListener = scrollListener.addCallback(() =>
				this.runNowOrOnScroll(condition.bind(this), callback.bind(this)),
			);
		}
	}

	private isCorrectPositionReached(): boolean {
		const isStickyOnTop = () => {
			if (!this.refreshInfo.positionTopToViewport || !this.config.topPositionToRun) {
				return false;
			}

			return this.refreshInfo.positionTopToViewport < this.config.topPositionToRun;
		};

		const isStartPositionReached = () => this.refreshInfo.startPosition <= window.scrollY;

		return isStartPositionReached() || isStickyOnTop();
	}

	private isInViewport(): boolean {
		return utils.isInViewport(this.slotContainer);
	}

	private removeScrollListener(): void {
		if (this.rotatorListener) {
			scrollListener.removeCallback(this.rotatorListener);
			this.rotatorListener = null;
		}
	}

	private isRotationFinished(): boolean {
		return (
			!context.get(`slots.${this.slotNamePrefix}${this.refreshInfo.repeatIndex}`) ||
			universalAdPackage.isFanTakeoverLoaded()
		);
	}

	private pushNextSlot(): void {
		context.push('state.adStack', { id: `${this.slotNamePrefix}${this.refreshInfo.repeatIndex}` });
		this.refreshInfo.repeatIndex++;
	}
}
