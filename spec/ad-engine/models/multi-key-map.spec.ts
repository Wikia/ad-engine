import { MultiKeyMap } from '@wikia/ad-engine/models/multi-key-map';
import { expect } from 'chai';

describe('MultiKeyMap', () => {
	const value1 = { name: 'value1' };
	const value2 = { name: 'value2' };

	it('should work with clear', () => {
		const map = new MultiKeyMap<string, any>();

		map.set('a', value1);
		map.set('b', value2);
		map.clear();

		expect(Array.from(map.values())).to.deep.equal([]);
		expect(map.has('a')).to.equal(false);
		expect(map.has('b')).to.equal(false);
	});

	it('should work one value with multiple keys', () => {
		const map = new MultiKeyMap<string, any>();

		map.set('a', value1);
		map.set('b', value1);

		expect(map.has('a')).to.equal(true);
		expect(map.has('b')).to.equal(true);

		expect(Array.from(map.values())).to.deep.equal([value1]);

		const a = map.get('a');
		const b = map.get('b');

		expect(a).to.equal(b);

		map.delete('a');

		expect(map.has('a')).to.equal(false);
		expect(map.has('b')).to.equal(false);

		expect(Array.from(map.values())).to.deep.equal([]);
	});

	it('should work with overwriting', () => {
		const map = new MultiKeyMap<string, any>();

		map.set('a', value1);
		map.set('b', value1);
		map.set('a', value2);

		expect(map.get('a')).to.equal(value2);
		expect(map.get('b')).to.equal(value1);

		expect(Array.from(map.values())).to.deep.equal([value1, value2]);

		map.delete('b');

		expect(Array.from(map.values())).to.deep.equal([value2]);
		expect(map.get('a')).to.equal(value2);
		expect(map.get('b')).to.equal(undefined);
	});
});
