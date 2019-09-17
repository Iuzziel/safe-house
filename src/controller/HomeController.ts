import path from 'path';
import fs from 'fs';

import { Controller } from '../router/Controller';
import { Route } from '../router/Route';

@Controller('/')
export class HomeController {
	constructor() { }

	@Route({ method: 'get', path: '/', templateUrl: 'templates/index.html' })
	public static index(template?: string) {
		if (template)
			return fs.readFileSync(path.join(process.cwd(), template)).toString();
		else
			return `<h1>Index page without template system.</h1>`;
	}

}