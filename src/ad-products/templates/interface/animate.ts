import { utils } from '@ad-engine/core';

export async function animate(container, className, duration) {
	container.style.animationDuration = `${duration}ms`;
	container.classList.add(className);
	await utils.wait(duration);
	container.classList.remove(className);
	container.style.animationDuration = '';
}
