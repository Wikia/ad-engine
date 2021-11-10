import { communicationService } from '@ad-engine/communication';
import { videoLearnMoreDisplayedEvent } from '@ad-engine/tracking';
import { getTranslation } from '../../../common/i18n';
import { createIcon, icons } from '../icons';

function add(video, container, params): void {
	const learnMore = document.createElement('div');
	const icon = createIcon(icons.LEARN_MORE, ['learn-more-icon', 'porvata-icon']);
	const label = document.createElement('div');

	label.innerText = getTranslation('labels', 'learn-more');
	learnMore.appendChild(label);
	learnMore.appendChild(icon);

	learnMore.classList.add('learn-more');
	learnMore.addEventListener('click', () => {
		top.open(params.clickThroughURL, '_blank');
	});

	communicationService.dispatch(
		videoLearnMoreDisplayedEvent({
			adSlotName: video.settings.getSlotName(),
			learnMoreLink: learnMore,
		}),
	);

	container.appendChild(learnMore);
}

export default {
	add,
};
