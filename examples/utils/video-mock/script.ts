import { utils } from '@wikia/ad-engine';

const preElement = document.getElementById('video');

preElement.innerText = utils.client.canPlayVideo()
	? 'Video player can be loaded and play a video'
	: 'Video player cannot be loaded';
