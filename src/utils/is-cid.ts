export function isCid(link: string | { [key: string]: string }): boolean {
    // CIDv1: Starts with "b" followed by base encoding character (z or k or m) followed by multihash
    // CIDv0: Multihash encoded in base58btc
    // This is a very basic check and may not cover all possible CID formats
    const cidRegex = /^(b[zkm][a-zA-Z0-9]{1,})|([Qm][a-zA-Z0-9]{44})$/;

    if (typeof link === 'string') {
        return cidRegex.test(link);
    } else if (typeof link === 'object' && link !== null) {
        return link.hasOwnProperty('/') && typeof link['/'] === 'string' && cidRegex.test(link['/']);
    }

    return false;
}