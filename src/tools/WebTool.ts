export class WebTool {
	public static getMimeType(completeFileName: string): string {
		switch (completeFileName.slice(completeFileName.lastIndexOf('.'))) {
			case '.html':
				return 'text/html';
			case '.ico':
				return 'image/x-icon';
			case '.jpg':
				return 'image/jpeg';
			case '.png':
				return 'image/png';
			case '.gif':
				return 'image/gif';
			case '.css':
				return 'text/css';
			case '.js':
				return 'text/javascript';
			default:
				return 'text/plain';
		}
	}
}