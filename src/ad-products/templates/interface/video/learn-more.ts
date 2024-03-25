// @ts-strict-ignore
import { communicationService } from '@ad-engine/communication';
import { utils } from '@ad-engine/core';
import { createIcon, icons } from '../icons';
import { AD_ENGINE_VIDEO_LEARN_MORE_CLICKED } from "../../../../communication/events/events-ad-engine-video";

export class LearnMore {
	static add(video, container, params): void {
		const learnMore = document.createElement('div');
		const icon = createIcon(icons.LEARN_MORE, ['learn-more-icon', 'porvata-icon']);
		const label = document.createElement('div');

		label.innerText = utils.getTranslation('learn-more');
		learnMore.appendChild(label);
		learnMore.appendChild(icon);

		learnMore.classList.add('learn-more');
		learnMore.addEventListener('click', () => {
			top.open(params.clickThroughURL, '_blank');

			communicationService.emit(AD_ENGINE_VIDEO_LEARN_MORE_CLICKED, {
				adSlotName: video.settings.getSlotName(),
				ad_status: 'learn-more-click',
			});
		});

		container.appendChild(learnMore);
	}
}
