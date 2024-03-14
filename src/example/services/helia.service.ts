import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { json } from '@helia/json'
import { bootstrap } from '@libp2p/bootstrap'
import { identify } from '@libp2p/identify'
import { tcp } from '@libp2p/tcp'
import { LevelBlockstore } from 'blockstore-level'
import { MemoryDatastore } from 'datastore-core'
import { HeliaLibp2p, createHelia } from 'helia'
import { Level } from 'level'
import { createLibp2p } from 'libp2p'
import { CID } from 'multiformats/cid'
import { Service } from '../../index.js'

@Service
export class HeliaService {

  public heliaNode: HeliaLibp2p<any>

  private _fileList : CID

  public permanentStorage : Level<string, Uint8Array>

  async getFileList() {
    if(!this._fileList){
      let fileList;
      try{
        fileList = await this.permanentStorage.get('pdf-storage-dir')
      } catch(e) {}

      if(!fileList) {
        const rootList = await json(this.heliaNode)
        const root = await rootList.add([])
        await this.permanentStorage.put('pdf-storage-dir', root.bytes)
        this._fileList = root
      } else {
        this._fileList = CID.decode(fileList)
      }
    }
    return this._fileList
  }

  setFileList(dir : CID) {
    this._fileList = dir
  }



  constructor() {
    this.createNode()
  }

  async createNode() {
    // the blockstore is where we store the blocks that make up files
    // const blockstore = new MemoryBlockstore()
    const blockstore = new LevelBlockstore('./leveldb')

    this.permanentStorage = blockstore.db

    // application-specific data lives in the datastore
    const datastore = new MemoryDatastore()

    // libp2p is the networking layer that underpins Helia
    const libp2p = await createLibp2p({
      datastore,
      addresses: {
        listen: [
          '/ip4/127.0.0.1/tcp/0'
        ]
      },
      transports: [
        tcp()
      ],
      connectionEncryption: [
        noise()
      ],
      streamMuxers: [
        yamux()
      ],
      peerDiscovery: [
        bootstrap({
          list: [
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
            '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
          ]
        })
      ],
      services: {
        identify: identify()
      }
    })

    this.heliaNode = await createHelia({
      datastore,
      blockstore,
      libp2p
    })
  }
}