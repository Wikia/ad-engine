import { queryString } from './query-string';

function isSamplingIgnored(name) {
	const ignored = (queryString.get('ignored_samplers') || '').split(',');

	return ignored.indexOf(name) !== -1;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

class Sampler {
	sample(name, sampling, max = 100) {
		return isSamplingIgnored(name) ? true : getRandomInt(0, max) < sampling;
	}
}

export const sampler = new Sampler();
