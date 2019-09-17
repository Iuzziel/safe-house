import path from 'path';
import { DataAccess } from '../database';

var configFile = path.resolve(process.cwd(), 'static/config.json');

export interface DatabaseOptionFormat {
	user?: string;
	database?: string;
	password?: string;
	port?: number;
	host?: string;
}

export interface ServerOptionFormat {
	host: string;
	port: number;
}

export interface ApiOptionFormat {
	topic: string,
	host: string,
	path: string
}

export interface ConfigFormat {
	server: ServerOptionFormat,
	database: DatabaseOptionFormat,
	api: Array<ApiOptionFormat>
}

class ConfigurationService {
	public static loadOptionFile(): ConfigFormat {
		return require(configFile);
	}
}

export class ServerService extends ConfigurationService {
	public static getOptions(): ServerOptionFormat {
		return ConfigurationService.loadOptionFile().server;
	}
}

export class DatabaseService extends ConfigurationService {
	public static getInstance(): DataAccess {
		return DataAccess.getInstance(DatabaseService.getOptions());
	}

	public static getOptions(): DatabaseOptionFormat {
		return ConfigurationService.loadOptionFile().database;
	}
}

export class ApiService extends ConfigurationService {
	public static getOptions(): DatabaseOptionFormat {
		return ConfigurationService.loadOptionFile().database;
	}
}
