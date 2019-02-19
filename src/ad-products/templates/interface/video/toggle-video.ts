function add(video, container) {
	video.addEventListener('wikiaAdStarted', () => {
		container.classList.remove('hide');
	});

	video.addEventListener('wikiaAdCompleted', () => {
		container.classList.add('hide');
	});
}

export default {
	add,
};
