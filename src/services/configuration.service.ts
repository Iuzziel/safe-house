import path from 'path';
import http from 'http';

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
	path: string,
	endpoints?: Array<ApiEndpointFormat>
}

export interface ApiEndpointFormat {
	data: string,
	endpoint: string,
	parameters: Array<ApiEndpointParametersFormat>
}

export interface ApiEndpointParametersFormat {
	name: string,
	options?: Array<string>,
	required: boolean
}

export interface ApiEndpointRequest {
	topic: string,
	data: string,
	parameters?: Map<string, string>
}

export interface ApiEndpointResponse {
	data: string,
	created: Date,
	totalSize: number,
	row?: Object
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

export class DataService extends ConfigurationService {
	public static getInstance(): DataAccess {
		return DataAccess.getInstance(DataService.getOptions());
	}

	public static getOptions(): DatabaseOptionFormat {
		return ConfigurationService.loadOptionFile().database;
	}
}

export class ApiService extends ConfigurationService {
	public static getOptions(): Array<ApiOptionFormat> {
		return ConfigurationService.loadOptionFile().api;
	}

	public static getTopic(topic: string): ApiOptionFormat {
		let r = ConfigurationService.loadOptionFile().api.find(v => v.topic === topic);
		if (!r) throw new Error(`Api topic "${topic}" option not found !`);
		return r;
	}

	public static getEndpoint(reqOptions: ApiEndpointRequest): Promise<ApiEndpointResponse> {
		let r = ApiService.getTopic(reqOptions.topic);
		if (!r.endpoints) throw new Error(`Api endpoints option for topic "${reqOptions.topic}" not found !`);
		let t = r.endpoints.find(v => v.data === reqOptions.data);
		if (!t) throw new Error(`Api endpoint "${reqOptions.data}" option not found !`);
		let url = `${r.host}${r.path}`.replace(`[endpoint]`, t.endpoint);
		if (reqOptions.parameters) {
			url += `?`;
			for (const [k, v] of reqOptions.parameters.entries()) {
				url += `${k.toLowerCase().trim()}='${v.toLowerCase().trim()}'&`;
			}
			if (url.endsWith('&') || url.endsWith('?')) url = url.slice(0, url.length - 1);
		}
		return new Promise((resolve, reject) => {
			http.get(url, (res) => {
				const { statusCode } = res;
				const contentType = res.headers['content-type'];
				if (!contentType) throw new Error(`Content-type not found in response !`);

				let error;
				if (statusCode !== 200) {
					error = new Error('Request Failed.\n' +
						`Status Code: ${statusCode}`);
				} else if (!/^application\/json/.test(contentType)) {
					error = new Error('Invalid content-type.\n' +
						`Expected application/json but received ${contentType}`);
				}
				if (error) {
					res.resume();
					reject(error)
				}
				res.setEncoding('utf8');
				let rawData = '';
				res.on('data', (chunk) => { rawData += chunk; });
				res.on('end', () => {
					try {
						const parsedData = JSON.parse(rawData);
						let psName = Object.getOwnPropertyNames(parsedData);
						//@ts-ignore
						let pName = psName.find(v => v === t.endpoint);
						if (!pName) throw new Error(`Unexpected result from the query!`);
						let pValue = Reflect.get(parsedData, pName);
						if (!pValue.queryResults && (!pValue.queryResults.totalSize && !pValue.queryResults.created))
							throw new Error(`Unknown response from the query! ${JSON.stringify(pValue)}`);
						resolve({
							data: reqOptions.data,
							created: new Date(pValue.queryResults.created),
							totalSize: Number.parseInt(pValue.queryResults.totalSize),
							row: pValue.queryResults.row
						});
					} catch (e) {
						reject(e);
					}
				});
			}).on('error', (e) => {
				reject(e);
			});
		})
	}
}
