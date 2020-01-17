import path from 'path';
import fs from 'fs';

import { Controller } from '../router/Controller';
import { Route } from '../router/Route';
import { server } from '../main';

@Controller('/api')
export class ApiController {
	constructor() { }

	@Route({ method: 'get', path: '/start' })
	public static start() {
		return JSON.stringify({ success: true, message: 'It works!' })
	}

}