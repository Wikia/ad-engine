interface IasSlotConfig {
	adUnitPath: string;
	adSlotId: string;
	size: number[];
	type?: string;
}

interface IasPetQueueElement {
	adSlots: IasSlotConfig[];
	dataHandler: (string) => void;
}

interface IasPet {
	queue?: IasPetQueueElement[];
	pubId?: string;
}
