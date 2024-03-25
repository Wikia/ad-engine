import { Action } from "@wikia/post-quecast";

export interface EventOptions {
    category?: string;
    name: string;
    payload?: any;
    action?: Action;
}
