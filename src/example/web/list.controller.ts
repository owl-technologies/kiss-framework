import { json } from '@helia/json';
import { Controller, Get } from "../../index.js";
import { HeliaService } from "../services/helia.service.js";

@Controller
export class IndexHtmlController {
    constructor(
        private heliaService = new HeliaService()
    ) { }


    @Get()
    async listFiles(req : Request, res: Response) {
        const heliaNode = this.heliaService.heliaNode
        const heliaJson = json(heliaNode)
        const fileListCid = await this.heliaService.getFileList()
        const fileList =  await heliaJson.get(fileListCid) as any[]
        return fileList
    }
}