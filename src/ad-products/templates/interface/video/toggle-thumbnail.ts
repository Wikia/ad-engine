function add(video, container, params) {
	video.addEventListener('wikiaAdStarted', () => {
		params.thumbnail.classList.add('hidden-state');
	});

	video.addEventListener('wikiaAdCompleted', () => {
		params.thumbnail.classList.remove('hidden-state');
	});
}

export default {
	add,
};
