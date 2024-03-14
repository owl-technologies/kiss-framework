import { unixfs } from "@helia/unixfs";
import { Request, Response } from "express";
import { CID } from "multiformats/cid";
import { Controller, Get } from "../../index.js";
import { HeliaService } from "../services/helia.service.js";

@Controller
export class GetFileController {
    constructor(
        private heliaService = new HeliaService()
    ) { }


    @Get(Request, Response, 'cid')
    async getFile(req: Request, res: Response, fileCidStr: string) {
        const fileCid = CID.parse(fileCidStr)
        console.log(`fileCid:`, fileCid.toJSON())
        const heliaNode = this.heliaService.heliaNode
        const fs = unixfs(heliaNode)
        res.setHeader('Content-Type', 'application/pdf')
        for await (const chunk of fs.cat(fileCid)) {
            res.write(chunk)
        }
        res.end()
    }
}