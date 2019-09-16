const duration = 400;
const onAnimationClassName = 'on-animation';

function resizeContainer(container, finalAspectRatio): void {
	container.style.height = `${container.offsetHeight}px`;
	container.style.height = `${container.offsetWidth / finalAspectRatio}px`;

	setTimeout(() => {
		container.style.height = '';
	}, duration);
}

function toggle(elementToShow, elementToHide): void {
	elementToHide.classList.add('hide');
	elementToShow.classList.remove('hide');
}

function hideVideo(video, params): void {
	resizeContainer(params.container, params.aspectRatio);
	setTimeout(() => {
		toggle(params.image, video.container);
		params.container.classList.remove(onAnimationClassName);
	}, duration);
}

function showVideo(video, params): void {
	params.container.classList.add(onAnimationClassName);
	resizeContainer(params.container, params.videoAspectRatio);
	toggle(video.container, params.image);
}

function add(video, container, params): void {
	video.addEventListener('wikiaAdStarted', () => {
		showVideo(video, params);
	});

	video.addEventListener('wikiaAdCompleted', () => {
		hideVideo(video, params);
	});
}

export default {
	add,
	duration,
};
