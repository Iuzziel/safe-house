import { EventEmitter } from 'events';

export class DataAccess extends EventEmitter {
	private static instance: DataAccess;

	constructor(options?: any) {
		super();
		if (DataAccess.instance) {
			throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
		}
		DataAccess.instance = this;
		return this;
	}

	public static getInstance(options?: any): DataAccess {
		if (DataAccess.instance) {
			return DataAccess.instance;
		} else {
			return new DataAccess(options);
		}
	}
}