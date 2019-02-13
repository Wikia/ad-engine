import { utils } from '@wikia/ad-engine';

const preElement = document.getElementById('checked');

utils.client.checkBlocking(
	() => {
		preElement.innerText = 'Blocking enabled';
	},
	() => {
		preElement.innerText = 'Blocking disabled';
	},
);
