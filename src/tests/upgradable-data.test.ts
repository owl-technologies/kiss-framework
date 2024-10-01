import { GetSetJson, InitJson, KissConfig, KissSerializableData, KissUpgradableData, Length, RegisterMigrate, Required, describe, expect, it } from "kiss-framework";

// configure 2 as the current version

KissConfig.CURRENT_VERSION = 2;

const authorJson = {
  "age": 42,
  "name": "John Doe",
  "protocol-version": 1,
}

class TestPerson extends KissUpgradableData {

  @InitJson()
  @Length(2, 32)
  @Required()
  name: string;

  @InitJson()
  @Required()
  age: number;

  @RegisterMigrate
  migrate(from: any) {
    const version = +from['protocol-version'];
    switch (true) {
      case version <= KissConfig.CURRENT_VERSION:
        console.log(`Upgrading TestPerson from ${version} to ${KissConfig.CURRENT_VERSION}`);
        from['protocol-version'] = KissConfig.CURRENT_VERSION;
        break;
      default:
        throw new Error(`Unsupported TestPerson protocol-version ${from['protocol-version']} for ${this.constructor?.name}`);
    }
    return from;
  }
}
  
class TestImage extends KissSerializableData {

  /**
   * Equivalent to accessor image : ArrayBuffer | Promise<ArrayBuffer>
   * Classes that extend TestImage can use decorators to define the accessor
   * that will retrieve the data from the link or return the promise.
   * Accessors implementations can lazy-load the data, using cache.
   */
  @GetSetJson()
  accessor image: string;

  /**
   * Declared without accessor typeword means it will be required to call get() / set()
   * to retreave and save the data. 
   */
  @InitJson()
  thumbnail: string;
}

class TestAdmin extends TestPerson {
  @InitJson()
  @Required()
  isAdmin = true;
}


const imgJson = {
    "author": authorJson,
    "image": "QmR7q8dPwppEbWPB5Q5cofJozQCDixnWKnJttbYcz6vfVA",
    "protocol-version": 1,
    "thumbnail": "Qmbxy9YevKmjQBX18u1GmyHQgMKbGzafKhf8AxciTKnsUT",
    "profilePicture": "Qmbxy9YevKmjQBX18u1GmyHQgMKbGzafKhf8AxciTKnsUT"
  }

class CopyrightedImage extends TestImage {

  @InitJson(TestPerson)
  author: TestPerson;

  attributes: string[];
}

describe('testing KissSerializableData and KissUpgradableData functionality', () => {
  const img = new CopyrightedImage(imgJson);

  it('creates an instance of object with links', async () => {
    expect(img).toBeInstanceOf(CopyrightedImage);
  });

  it('accessors decorator to be initiated', async () => {
    expect(img.image).toBe(imgJson.image);
  });

  it('fields to be initiated', async () => {
    expect(img.thumbnail).toBe(imgJson.thumbnail);
  });

  it('serializing T extends KissSerializableData serializes only @Required and @Optional fields', () => {
    const cidImageJson = JSON.stringify(img);
    const expectedVersion = JSON.stringify({ "protocol-version": img["protocol-version"] });
    expect(cidImageJson).toBe(expectedVersion)
  });

  it('serializing T extends KissSerializableData produces ordered JSON of the fields', () => {
    const unorderedJSON = {
      "protocol-version": KissConfig.CURRENT_VERSION,
      "name": "John Doe",
      "age": 42
    }
    let testPersonSerialized = JSON.stringify(new TestPerson(unorderedJSON));
    expect(testPersonSerialized !== JSON.stringify(unorderedJSON))

    const orderedJSON = {
      "age": 42,
      "name": "John Doe",
      "protocol-version": KissConfig.CURRENT_VERSION
    }
    expect(testPersonSerialized).toBe(JSON.stringify(orderedJSON))
  });

  it('The T extends KissSerializableData are migrated to the latest version using T.migrate()', () => {
    const testPerson = new TestPerson(authorJson);
    expect(testPerson['protocol-version']).toBe(KissConfig.CURRENT_VERSION);
  });

  it('TestAdmin that extends TestUser uses parents migrate method to update current version', () => {
    const adminJson = {
      ...authorJson,
      'protocol-version': 1,
      isAdmin: true
    }
    // console.debug('adminJson:', JSON.stringify(adminJson));
    const admin = new TestAdmin(adminJson);
    expect(admin['protocol-version']).toBe(KissConfig.CURRENT_VERSION);
    expect(admin.isAdmin).toBe(true);
  });

})