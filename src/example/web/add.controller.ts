import { json } from '@helia/json';
import { unixfs } from '@helia/unixfs';
import { Request } from 'express';
import { CURRENT_VERSION, Controller, Post, assert } from "../../index.js";
import { PdfFile } from '../datatypes/pdf-file.js';
import { HeliaService } from "../services/helia.service.js";

@Controller
export class AddFileController {
    constructor(
        private heliaService = new HeliaService()
    ) { }

    @Post(Request)
    async addFile(req: Request) {
        const ownerId = req.headers['ownerid'];
        const filename = req.headers['filename'];
        assert(ownerId, "Request does not contain ownerId");
        assert(filename, "Request does not contain filename");
      
        const heliaNode = this.heliaService.heliaNode
        const fs = unixfs(heliaNode)

        const content = await fs.addByteStream(<any>req);
        const pdfFile = new PdfFile({
            "protocol-version": CURRENT_VERSION,
            name: filename,
            ownerId,
            content: content.toJSON()
        });

        const fileListCid = await this.heliaService.getFileList();
        const nodeJson = json(heliaNode);
        const fileList = await nodeJson.get(fileListCid) as any[]
        fileList.push(pdfFile.toJSON());
        const newfileListCid = await nodeJson.add(fileList);
        this.heliaService.setFileList(newfileListCid);
        return newfileListCid;
      }

      
    // async addFile(req : Request) {
    //     const heliaNode = this.heliaService.heliaNode
    //     const fs = unixfs(heliaNode)
    //     assert(req, "Request does not contain file content")
    //     const fileCid = await fs.addByteStream(<any>req)
    //     const cidJson = fileCid.toJSON()
    //     const dir = await this.heliaService.getCurrentDir()
    //     const newDir = await fs.cp(fileCid,dir,cidJson['/'])
    //     this.heliaService.setCurrentDir(newDir)
    //     console.log("added file:", cidJson)
    //     return cidJson
    // }
}

