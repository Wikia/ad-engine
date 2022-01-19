export class SequenceDetector {
	constructor(private line_item_ids: string[]) {}

	isAdSequential(line_item_id: string): boolean {
		return this.line_item_ids.includes(line_item_id);
	}
}
