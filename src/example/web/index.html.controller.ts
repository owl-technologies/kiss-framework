import { Request } from "express";
import fs from "fs";
import { Controller, Get } from "../../index.js";


@Controller
export class IndexHtmlController {
    @Get()
    async getIndex(req : Request, res: Response) {
        // read index.html file from disk
        const indexHtml = await fs.promises.readFile('./src/example/web/index.html', 'utf8')
        return indexHtml
    }
}