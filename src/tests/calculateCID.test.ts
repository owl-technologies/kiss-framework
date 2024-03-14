
import { it, expect, describe, calculateCID, KissData, InitJson, Required, InitJsonArray } from "../index.js";

const testJson1 = { "data": "Hello, world!" }
const expectedCid1 = 'baguqeerahzkw6mlkqbxf3kzeden77ju5yqafg3ma7iang5wxqqiciu74t5pq'

class License extends KissData {

    @InitJson()
    @Required()
    title: string;
  
    @InitJson()
    @Required()
    short: string;
  
    @InitJsonArray()
    @Required()
    icons: ('CC' | 'BY' | 'NC' | 'ND' | 'SA' | 'ZERO' | 'CUSTOM')[];
  
    @InitJson()
    @Required()
    summary: string;
  
    @InitJson()
    @Required()
    "full-text": string;
  
  }

describe('CID Hashing', () => {
    it('should calculate the CID for a given object', async () => {
        const cid = await calculateCID(testJson1);
        expect(cid).toBe(expectedCid1);
    });
});

const testJson2 = {
    "activeStep": -1,
    "authorId": "8505hd51b4e11gg41974034ab9c4f7g",
    "encryptionKey": {
        "cipherText": "Ioh8qv2RVQX7ze4ZUMlfCVlYWh9IFnpB8c43DFOlg2cIK/1LRBFoTY0ACZG4zfdo7LhMUw==",
        "initVector": "0UTMXTeIylpgpveF",
        "protocol-version": 0.1
    },
    "ownerId": "1cfa65e3907303aa5a6f60ah8579ea",
    "protocol-version": 0.1,
    "protocolId": "60e6a3b1850hah2g49h91910a8452f8",
    "publicKey": "baguqeeraw33mt55yvtmrekkd2dx7wk2pygd4z2mvv5revig7wx4na774vcma",
    "signature": "AeNUGKY3ViV6fuvWNS4uFA6+dObDGoiXS8WdnDBccEpKGjdRqwAqdOLW+2qihJxd5Mj49vCU0cBWq2IunExnkWdGAAvLeoUwcVbIdElrtwnp2O6IqikULBcSEr/36jLOogyKmVONYVn4LaxzlNq69SlpkJguBftNxyBF+2kb9Y/WMCrF",
    "timestamp": 1687724294916,
    "verifyKey": "baguqeeralzdadqj2xzr2d6zvb6mgkfjr4dqhetjhbvaiyz2b6ya5mw53o2ea"
}
const expectedCid2 = 'baguqeeravpujnsv3iai4djzb2xru4ws6yaqtnlkwrk5shepiwryc4rlbhuxq';

describe('CID Hashing', () => {
    it('should calculate the CID for a given object', async () => {
        // const t = new License(testTransaction);
        const cid = await calculateCID(testJson2);
        expect(cid).toBe(expectedCid2);
    });
});

const testJson3 = { "activeStep": -1, "authorId": "8505hd51b4e11gg41974034ab9c4f7g", "encryptionKey": { "cipherText": "gXXWc+SZczHaVFbazS+4FGBwNE/Ayr7ppqXfCqe6G+leDlUeatlQ2agYUUjGbCs38lwl", "initVector": "MhMj1dL6Eacy15u9", "protocol-version": 0.1 }, "ownerId": "1cfa65e3907303aa5a6f60ah8579ea", "protocol-version": 0.1, "protocolId": "27ef1cf16e74af4378c32ba13a31geb", "publicKey": "baguqeeraw33mt55yvtmrekkd2dx7wk2pygd4z2mvv5revig7wx4na774vcma", "signature": "ASRfnxwO7/apJOnSalyCCQ0qq6bHmVhjDl2ly4A6vmt0Pbh579tD58YeMM+0HpOG2px45C9S9LbTDfnvQTJLsgseAMFEi2+lH+yrKK9f083+bk84zbkRcq0jqPfmFzYtySIaMaLBN5j39sVZMBDwHgfwICKy7y/1wdUZcDyfBe/obDE7", "timestamp": 1687724295176, "verifyKey": "baguqeeralzdadqj2xzr2d6zvb6mgkfjr4dqhetjhbvaiyz2b6ya5mw53o2ea" }
const expectedCid3 = 'baguqeeranhwk5d3y5vtf6lk3uvncliajsjzuom224gxd4ikzbzqzfgt7pgoq'
describe('more CID Hashing', () => {
    it('should calculate the CID for a given object', async () => {
        const cid = await calculateCID(testJson3);
        expect(cid).toBe(expectedCid3);
    });
});

const testJson4 = {"activeStep":-1,"authorId":"8505hd51b4e11gg41974034ab9c4f7g","encryptionKey":{"cipherText":"AEtKUmQwoXJDGEXnPHg4oQV/2k0nrXxVG5fn7DedzuMSag6NV/ubGs4MYbqnum8FFxZy","initVector":"HVCNbjVno0pvn8Az","protocol-version":0.1},"ownerId":"1cfa65e3907303aa5a6f60ah8579ea","protocol-version":0.1,"protocolId":"66662bac7e5542c93585dg4g738gah","publicKey":"baguqeeraw33mt55yvtmrekkd2dx7wk2pygd4z2mvv5revig7wx4na774vcma","signature":"ASDkr29v67u+RQ7jDJg6I4G7/0PCTDk+MefIF5MrcM2T3MeeUk5rxVdk5PfuEcntDoZUTbnfbA9L52jjfVs1EK28AL9lkmLhRwhJ+/pkpYBqF43GQp9rm91O+qL4oi8r4/SNxigA9OdisYRA3fB5aqXEGs42BY/ieYoRbNtwUYLMUm1U","timestamp":1687724301679,"verifyKey":"baguqeeralzdadqj2xzr2d6zvb6mgkfjr4dqhetjhbvaiyz2b6ya5mw53o2ea"}
const expectedCid4 = 'baguqeeraawagcfl2jusldnhaiylas7azxaa2uxaw7thj5lyr67lies6yontq'
describe('more CID Hashing', () => {
    it('should calculate the CID for a given object', async () => {
        const cid = await calculateCID(testJson4);
        expect(cid).toBe(expectedCid4);
    });
});

const testJson5 = {"author":16,"comment":"I was really disappointed with this product. It didn't work as expected and the quality was poor. Delivery was on time though.","images":[{"imageUrl":"https://picsum.photos/id/149/500/500","thumbnail":"https://picsum.photos/id/149/100/100"},{"imageUrl":"https://picsum.photos/id/151/500/500","thumbnail":"https://picsum.photos/id/151/100/100"}],"protocol":34,"protocol-version":0.1,"rating":2}
const expectedCid5 = 'baguqeerandsdjmmhxioytv3ibcos3udy7jjk62zop2l3sih34yuuk2syxo6q'
describe('more CID Hashing', () => {
    it('should calculate the CID for a given object', async () => {
        const cid = await calculateCID(testJson5);
        expect(cid).toBe(expectedCid5);
    });
});

const testLicenseJson = {
    "protocol-version": 0.2,
    title: "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication",
    short: "CC0 1.0",
    icons: ["CC", "ZERO"],
    summary: "CC-ZERO-1.0.summary.json",
    "full-text": "CC-ZERO-1.0.json"
}

describe('testLicense', () => {
    it('should calculate the CID for a given object', async () => {
        const testLicense = new License(testLicenseJson);
        const cid = await calculateCID(testLicense);
        // console.log('CID: ', cid);
        expect(cid.length).toBeGreaterThan(1);
    });
})