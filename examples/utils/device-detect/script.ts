import { utils } from '@wikia/ad-engine';

const preElement = document.getElementById('device');

preElement.innerText = utils.client.getDeviceType();
