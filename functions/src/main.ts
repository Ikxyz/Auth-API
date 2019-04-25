
import * as Hash from "scrypt";

export const getHash = async (email: string) => {
    if (email == null) return;

    const key = new Buffer(email);
  
    const e = await Hash.hash(key, { "N": 16, "r": 1, "p": 1 }, 64, "");
    console.log(e.toString('hex'));
    return e.toString('hex');
}