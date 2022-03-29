import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, FuncPipeline, FuncPipelineStep, slotService, utils } from '@ad-engine/core';

const logGroup = 'ad-click-tracker';
const celtraInterstitialBannerId = 'celtra-banner';
const celtraInterstitialSelector = '#celtra-banner .celtra-screen-container';

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
		click_position?: string;
	};
}

class AdClickTracker {
	private pipeline = new FuncPipeline<AdClickContext>();

	add(...middlewares: FuncPipelineStep<AdClickContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	register(callback: FuncPipelineStep<AdClickContext>): void {
		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ adSlotName }) => {
			this.addClickTrackingListeners(callback, adSlotName);
		});

		communicationService.on(
			eventsRepository.AD_ENGINE_VIDEO_LEARN_MORE_DISPLAYED,
			({ adSlotName, learnMoreLink }) => {
				this.addClickVideoLearnMoreTrackingListeners(callback, adSlotName, learnMoreLink);
			},
			false,
		);

		communicationService.on(eventsRepository.GAM_INTERSTITIAL_LOADED, () => {
			this.addCeltraInterstitialClickTrackingListener(callback);
		});

		communicationService.on(
			eventsRepository.AD_ENGINE_VIDEO_OVERLAY_CLICKED,
			({ adSlotName }) => {
				this.pipeline.execute(
					{
						slot: slotService.get(adSlotName),
						data: {
							ad_status: 'replay-click',
						},
					},
					callback,
				);
			},
			false,
		);
	}

	private addClickTrackingListeners(callback: FuncPipelineStep<AdClickContext>, slotName): void {
		const adSlot = slotService.get(slotName);
		const iframeElement = adSlot.getIframe();
		const slotElement = adSlot.getAdContainer();

		if (!adSlot || !iframeElement) {
			utils.logger(logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (adSlot.getFrameType() === 'safe') {
			utils.logger(logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}

		const iframeBody = iframeElement.contentWindow.document.body;

		if (iframeBody && slotElement) {
			slotElement.firstElementChild.addEventListener('click', () => {
				this.handleClickEvent(callback, adSlot);
			});
			iframeBody.addEventListener('click', (e) => {
				this.handleClickEvent(callback, adSlot, e);
			});
		}
	}

	private addClickVideoLearnMoreTrackingListeners(
		callback: FuncPipelineStep<AdClickContext>,
		adSlotName: string,
		learnMoreLink: HTMLElement,
	): void {
		learnMoreLink.addEventListener('click', () => {
			this.handleClickEvent(callback, slotService.get(adSlotName));
		});
	}

	private addCeltraInterstitialClickTrackingListener(
		callback: FuncPipelineStep<AdClickContext>,
	): void {
		const observer = new MutationObserver(() => {
			const celtraIframe = document.querySelector('.notranslate > iframe') as HTMLIFrameElement;

			if (celtraIframe) {
				const celtraBanner = celtraIframe.contentWindow.document.querySelector(
					celtraInterstitialSelector,
				);
				if (celtraBanner) {
					celtraBanner.addEventListener('click', (event) => {
						this.handleClickEvent(
							callback,
							slotService.get('top_leaderboard'),
							event as MouseEvent,
						);
					});
					observer.disconnect();
				}
			}
		});
		observer.observe(document, {
			childList: true,
			subtree: true,
		});
	}

	private handleClickEvent(
		callback: FuncPipelineStep<AdClickContext>,
		slot: AdSlot,
		event?: MouseEvent,
	): void {
		const data = {
			ad_status: AdSlot.STATUS_CLICKED,
		};

		if (event) {
			const target = event.target as HTMLElement;
			const clickData = {
				click: { x: event.clientX, y: event.clientY },
				size: { x: target.offsetWidth, y: target.offsetHeight },
			};
			if (target.id == celtraInterstitialBannerId) {
				clickData['click'] = { x: event.offsetX, y: event.offsetY };
			}
			data['click_position'] = JSON.stringify(clickData);

			if (target.classList.contains('celtra-close-button')) {
				// quick-fix for iPhone in order not to track close button clicks
				return;
			}
		}

		this.pipeline.execute(
			{
				slot,
				data,
			},
			callback,
		);
	}
}

export const adClickTracker = new AdClickTracker();
