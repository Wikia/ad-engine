import { AdSlot, collapsedAdEvent, communicationService } from '@wikia/ad-engine';

export const addMessageBoxToCollapsedElement = (placeholder: HTMLElement, adSlot: AdSlot): void => {
	const messageBox = document.createElement('div');
	messageBox.className = 'message-box';

	const button = document.createElement('button');
	button.className = 'collapse-btn';
	button.innerHTML = 'hide';
	button.onclick = () => placeholder.classList.add('hide');
	adSlot.setStatus(AdSlot.STATUS_CLICKED_COLLAPSE);
	communicationService.dispatch(
		collapsedAdEvent({
			adSlotName: adSlot.getSlotName(),
			collapseButton: button,
		}),
	);

	const message = document.createElement('p');
	message.innerHTML =
		'It looks like your ad has not been loaded... You can remove the gap by clicking the button below. Enjoy your fandom! :)';

	messageBox.append(message, button);
	placeholder.appendChild(messageBox);
};
