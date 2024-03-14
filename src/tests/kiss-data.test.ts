import { CidLink, GetSetCid, InitCid, InitJson, KissData, Length, OpLink, OpServerLink, RegisterMigrate, Required } from "../index.js";

import { describe, expect, it } from "../index.js";
import { getCid } from "../utils/get-cid.js";
import { getLink } from "../utils/get-link.js";

const rawData = {
  "author": {
    "protocol-version": 0.2,
    "name": "John Doe",
    "age": 42
  },
  "image": "QmR7q8dPwppEbWPB5Q5cofJozQCDixnWKnJttbYcz6vfVA",
  "protocol-version": 0.2,
  "thumbnail": "Qmbxy9YevKmjQBX18u1GmyHQgMKbGzafKhf8AxciTKnsUT",
  "profilePicture": "Qmbxy9YevKmjQBX18u1GmyHQgMKbGzafKhf8AxciTKnsUT"
}

class TestPerson extends KissData {

  @InitJson()
  @Length(2, 32)
  @Required()
  name: string;

  @InitJson()
  @Required()
  age: number;

  @RegisterMigrate
  migrate (from: any) {
    switch (from['protocol-version']) {
      case undefined:
        throw new Error(`Protocol version is not defined in ${from}`)
      case 0.1:
        // Conversions from this.link 0.1 to 0.2 go here
        from['protocol-version'] = 0.2;
        return from
      default:
        throw new Error(`Unsupported protocol version ${from['protocol-version']} for ${this.constructor.name}`);
    }
  }
}

class TestImage extends KissData {

  /**
   * Equivalent to accessor image : ArrayBuffer | Promise<ArrayBuffer>
   * Classes that extend TestImage can use decorators to define the accessor
   * that will retrieve the data from the link or return the promise.
   * Accessors implementations can lazy-load the data, using cache.
   */
  accessor image: OpLink<ArrayBuffer>;

  /**
   * Declared without accessor typeword means it will be required to call get() / set()
   * to retreave and save the data. 
   */
  thumbnail: OpLink<ArrayBuffer>;

}

// Establish default link getter and setter
CidLink.ipfsGateway = getCid;
OpServerLink.searchGateway = getLink

class CopyrightedImage extends TestImage {

  @InitJson(TestPerson)
  author: TestPerson;

  @GetSetCid('arraybuffer')
  accessor image = undefined as any

  @InitCid('arraybuffer')
  thumbnail = undefined as any

  @InitCid('arraybuffer')
  profilePicture = undefined as any

  attributes: string[];
}

describe('Testing oplanto format functionality', () => {
  const img = new CopyrightedImage(rawData);

  it('creates an instance of object with links', async () => {
    expect(img).toBeInstanceOf(CopyrightedImage);
  });

  it('accessors decorator can wrap custom Link', async () => {
    const imgData = (await img.image.get()) as ArrayBuffer;
    expect(imgData.byteLength).toBeGreaterThan(1000);
  });

  it('fields can customize inhereted link fields with decorators', async () => {
    // since it was declared without accessor typeword it is required to call get()
    const tumbData = (await img.thumbnail.get()) as ArrayBuffer;
    expect(tumbData.byteLength).toBeGreaterThan(1000);
  });

  it('serializing T extends KissData serializes only @Required and @Optional fields', () => {
    const cidImageJson = JSON.stringify(img);
    const expectingOnlyVersion = JSON.stringify({ "protocol-version": img["protocol-version"]});
    expect(cidImageJson).toBe(expectingOnlyVersion)
  });

  it('serializing T extends KissData produces ordered JSON of the fields', () => {
    const unorderedJSON = {
      "protocol-version": 0.2,
      "name": "John Doe",
      "age": 42
    }
    let testPersonSerialized = JSON.stringify(new TestPerson(unorderedJSON));
    expect(testPersonSerialized !==  JSON.stringify(unorderedJSON))

    const orderedJSON = {
      "age": 42,
      "name": "John Doe",
      "protocol-version": 0.2
    }
    expect(testPersonSerialized).toBe(JSON.stringify(orderedJSON))
  });

  it('The T extends KissData are migrated to the latest version using T.migrate()', () => {
    const author = {
      "age": 42,
      "name": "John Doe",
      "protocol-version": 0.1,
    }
    const testPerson = new TestPerson(author);
    expect(testPerson['protocol-version']).toBe(0.2);
  });

})