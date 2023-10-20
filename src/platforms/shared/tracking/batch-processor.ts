interface Task {
	[key: string]: string;
}

export class BatchProcessor {
	batchedTasks: Task[][] = [];

	constructor(private tasksList: Task[], private batchSize: number, private delay: number) {
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

	dispatchEventsWithTimeout(taskProcessor): void {
		const batchTimer = setInterval(() => {
			if (this.batchedTasks.length <= 0) {
				clearInterval(batchTimer);
				return;
			}

			const batchToSend = this.batchedTasks.shift();
			batchToSend.forEach((task) => taskProcessor(task));
		}, this.delay);
	}
}
