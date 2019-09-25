import { EventEmitter } from 'events';
import { Player } from '../models';
import { ApiService, ApiEndpointFormat } from '../services';

export class BaseballApi extends EventEmitter {
	private static instance: BaseballApi;

	constructor(options?: any) {
		super();
		if (BaseballApi.instance) {
			throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
		}
		BaseballApi.instance = this;
		return this;
	}

	public static getInstance(options?: any): BaseballApi {
		if (BaseballApi.instance) {
			return BaseballApi.instance;
		} else {
			return new BaseballApi(options);
		}
	}

	// public static getPlayerData(playerId: string): Player {
	// 	ApiService.getEndpoint('baseball', 'player')
	// 	return;
	// }
}