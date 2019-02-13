import { utils } from '@wikia/ad-engine';

const preElement = document.getElementById('browser');

preElement.innerText = `${utils.client.getOperatingSystem()} ${utils.client.getBrowser()}`;
