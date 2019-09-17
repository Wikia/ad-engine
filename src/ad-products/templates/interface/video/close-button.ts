function add(video, container): void {
	const closeButton = document.createElement('div');

	closeButton.classList.add('close-ad');
	closeButton.addEventListener('click', (event) => {
		video.stop();
		event.preventDefault();
	});

	container.appendChild(closeButton);
}

export default {
	add,
};
