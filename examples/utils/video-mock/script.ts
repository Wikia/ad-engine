import { utils } from '@wikia/ad-engine';

const preElement = document.getElementById('video');
const preElementWindowCheck = document.getElementById('windowVersion');

preElementWindowCheck.innerText = window.canPlayVideo
	? 'window.canPlayVideo works'
	: 'window.canPlayVideo does not work';

preElement.innerText = utils.client.canPlayVideo()
	? 'Video player can be loaded and play a video'
	: 'Video player cannot be loaded';
