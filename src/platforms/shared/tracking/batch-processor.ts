export class BatchProcessor {
	batchedTasks = [];

	constructor(private tasksList: any[], private batchSize: number, private delay: number) {
		this.batchTasks();
	}

	private batchTasks(): void {
		this.batchedTasks = [...this.tasksList].reduce((resultArray, item, index) => {
			const chunkIndex = Math.floor(index / this.batchSize);

			if (!resultArray[chunkIndex]) {
				resultArray[chunkIndex] = [];
			}

			resultArray[chunkIndex].push(item);

			return resultArray;
		}, []);
	}

	dispatchEventsWithTimeout(sendRequest): void {
		const batchTimer = setInterval(() => {
			if (this.batchedTasks.length > 0) {
				const batchToSend = this.batchedTasks.shift();
				batchToSend.forEach(({ url, params, type }) => sendRequest(url, params, type));
			} else {
				clearInterval(batchTimer);
			}
		}, this.delay);
	}
}
