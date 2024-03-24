import { base } from "./base-x.js";

const base2 = base('01')
const base32rfc4648 = base('abcdefghijklmnopqrstuvwxyz234567');

/**
 * Calculate the dag-json CID of an object. Exclusively for dag-json objects.
 * 
 * @param obj any json object
 * @returns string CIDv2
 */
export const calculateCID = async (obj: any): Promise<string> => {
    const serialized = (typeof obj === 'string') ? obj : JSON.stringify(obj);
    const encoder = new TextEncoder();
    const data = encoder.encode(serialized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);

    // tryed to undestand https://proto.school/anatomy-of-a-cid/03, but 1A902 does not match the table prefixes
    // const dagJson = [0x01, 0x29]; // 0x0129 is the multicodec prefix for dag-json
    // const cidVersion = 0x01 // 0x01 is the CID version
    // const sha2hash = 0x12; //0x12 is the multihash code for SHA-256
    // const hashLength = 0x20; // 32 bytes in hexadecimal
    // const cid = Uint8Array.from([...cidVersionAndMultihashCode, ...hashLength , ...hashArray]);
    // giving up on the above, as it does not match https://proto.school/anatomy-of-a-cid/03

    // --------------------- Below is a hack to get the CID from the hashArray ---------------------
    // 
    // const testJson = { "data" : "Hello, world!" }
    // const expectedCid = 'baguqeerahzkw6mlkqbxf3kzeden77ju5yqafg3ma7iang5wxqqiciu74t5pq'
    //
    // from https://www.dcode.fr/base-n-convert with baguqeerahzkw6mlkqbxf3kzeden77ju5yqafg3ma7iang5wxqqiciu74t5pq
    //         baguqeerahzkw6mlkqbxf3kzeden77ju5yqafg3ma7iang5wxqqiciu74t5pq
    //          AGUQEERAHZKW6MLKQBXF3KZEDEN77JU5YQAFG3MA7IANG5WXQQICIU74T5PQ	₍₃₂₎	=	
    //          1A902                   12          20          3E556F316A806E5DAB24191BFFA69DC400536D80FA00D376D784102453FC9F5F    0	₍₁₆₎
    // b        1 A    9    0    2      sha2        32          digest                                                              padding???
    // 10000000 1 1010 1001 0000 0010   00010010    00100000    00111110010101010110111100110001011010101000000001101110010111011010101100100100000110010001101111111111101001101001110111000100000000000101001101101101100000001111101000000000110100110111011011010111100001000001000000100100010100111111110010011111010111110000	
    //          1 1010 1001 0000 0010   00010010    00100000    00111110010101010110111100110001011010101000000001101110010111011010101100100100000110010001101111111111101001101001110111000100000000000101001101101101100000001111101000000000110100110111011011010111100001000001000000100100010100111111110010011111010111110000	₍₂₎
    //                                  sha2        digest-len  
    // crypto.subtle.digest('SHA-256', data):                   ??11111001010101011011110011000101101010100000000110111001011101101010110010010000011001000110111111111110100110100111011100010000000000010100110110110110000000111110100000000011010011011101101101011110000100000100000010010001010011111111001001111101011111????
    // 
    // 0s prefix are in this strange form. is this due to very unusual octal to base32 fix? trying to hack it:
    // another example below: 
    //         BAGUQEERAVPUJNSV3IAI4DJZB2XRU4WS6YAQTNLKWRK5SHEPIWRYC4RLBHUXQ
    // crypto.subtle.digest('SHA-256', data):                   1010101111101000100101101100101010111011010000000001000111000001101001110010000111010101111000110100111001011010010111101100000000100001001101101010110101010110100010101011101100100011100100011110100010110100011100000010111001000101011000010011110100101111
    // 10000000 1 1010 1001 0000 0010   00010010    00100000    10101011111010001001011011001010101110110100000000010001110000011010011100100001110101011110001101001110010110100101111011000000001000010011011010101101010101101000101010111011001000111001000111101000101101000111000000101110010001010110000100111101001011110000	₍₂₎
    // Now prefix is absent, but suffix is present, assuming suffix is always present, and prefix is complement to 256 bits
    //
    // another example below:
    //         BAGUQEERAAWAGCFL2JUSLDNHAIYLAS7AZXAA2UXAW7THJ5LYR67LIES6YONTQ	₍₃₂₎	=	
    // crypto.subtle.digest('SHA-256', data):                   ?????10110000000011000010001010101111010010011010010010010110001101101001110000001000110000101100000100101111100000110011011100000000001101010100101110000010110111111001100111010011110101011110001000111110111110101101000001001001011110110000111001101100111????
    // 10000000 1 1010 1001 0000 0010   00010010    00100000    00000101100000000110000100010101011110100100110100100100101100011011010011100000010001100001011000001001011111000001100110111000000000011010101001011100000101101111110011001110100111101010111100010001111101111101011010000010010010111101100001110011011001110000	₍₂₎
    
    let digestBin = base2.encode(hashArray);
    let prefixLen = 256 - digestBin.length
    const additionalPrefix = '0'.repeat(prefixLen);
    const digestBinFix = '10000000110101001000000100001001000100000' + additionalPrefix + digestBin + '0000';
    // console.log('DIGEST hex: ', Buffer.from(hashArray).toString('hex'));
    // console.log(`DIGEST bin (${digestBin.length}) prefix:<${additionalPrefix}>: ${digestBin} `);
    const hashFix = base2.decode(digestBinFix);
    const cidBase32 = base32rfc4648.encode(hashFix);
    return cidBase32;
}