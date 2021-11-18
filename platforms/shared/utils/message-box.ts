import { AdSlot, collapsedAdEvent, communicationService } from '@wikia/ad-engine';

const createButton = (): HTMLButtonElement => {
	const button = document.createElement('button');
	button.className = 'collapse-btn';
	button.innerHTML = 'hide';
	return button;
};

const createMessage = (): HTMLElement => {
	const message = document.createElement('p');
	message.innerHTML =
		'It looks like your ad has not been loaded... You can remove the gap by clicking the button below. Enjoy your fandom! :)';
	return message;
};

const sendTrackingEvent = (adSlot: AdSlot) => {
	communicationService.dispatch(
		collapsedAdEvent({
			adSlotName: adSlot.getSlotName(),
		}),
	);
};

export const addMessageBoxToCollapsedElement = (placeholder: HTMLElement, adSlot: AdSlot): void => {
	const messageBox = document.createElement('div');
	messageBox.className = 'message-box';

	const button = createButton();
	button.onclick = () => {
		sendTrackingEvent(adSlot);
		placeholder.classList.add('hide');
	};

	const message = createMessage();

	messageBox.append(message, button);
	placeholder.appendChild(messageBox);
};
