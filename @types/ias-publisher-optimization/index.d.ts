interface IasPetQueueElement {
	adSlots: number[][];
	dataHandler: (string) => void;
}

interface IasPet {
	queue?: IasPetQueueElement[];
	pubId?: string;
}
