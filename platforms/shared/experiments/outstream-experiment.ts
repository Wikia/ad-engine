import { InstantConfigService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class OutstreamExperiment {
    private readonly enabled: boolean;
    private readonly chosenPlayer: string;

    constructor(protected instantConfig: InstantConfigService) {
        this.enabled = this.instantConfig.get('icOutstreamExperimentEnabled', false);
        this.chosenPlayer = this.instantConfig.get('icOutstreamExperiment', 'distroscale');
    }

    isExco(): boolean {
        return this.isPlayerEnabled('exco');
    }

    isConnatix(): boolean {
        return this.isPlayerEnabled('connatix');
    }

    isAnyclip(): boolean {
        return this.isPlayerEnabled('anyclip');
    }

    private isPlayerEnabled(playerName: string): boolean {
        return this.enabled && this.chosenPlayer === playerName;
    }
}
