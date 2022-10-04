import { queryString } from './query-string';

function isSamplingIgnored(name: string): boolean {
	const ignored: string[] = (queryString.get('ignored_samplers') || '').split(',');

	return ignored.indexOf(name) !== -1;
}

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min;
}

class Sampler {
	sample(name: string, sampling: number, max = 100): boolean {
		return isSamplingIgnored(name) ? true : getRandomInt(0, max) < sampling;
	}
}

export const sampler = new Sampler();
