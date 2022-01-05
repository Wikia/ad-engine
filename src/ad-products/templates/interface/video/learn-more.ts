import { communicationService, eventsRepository } from '@ad-engine/communication';
import { utils } from '@ad-engine/core';
import { createIcon, icons } from '../icons';

function add(video, container, params): void {
	const learnMore = document.createElement('div');
	const icon = createIcon(icons.LEARN_MORE, ['learn-more-icon', 'porvata-icon']);
	const label = document.createElement('div');

	label.innerText = utils.getTranslation('learn-more');
	learnMore.appendChild(label);
	learnMore.appendChild(icon);

	learnMore.classList.add('learn-more');
	learnMore.addEventListener('click', () => {
		top.open(params.clickThroughURL, '_blank');
	});

	communicationService.communicate(eventsRepository.AD_ENGINE_VIDEO_LEARN_MORE_DISPLAYED, {
		adSlotName: video.settings.getSlotName(),
		learnMoreLink: learnMore,
	});

	container.appendChild(learnMore);
}

export default {
	add,
};
