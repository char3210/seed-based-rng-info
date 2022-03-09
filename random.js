const multiplier = 0x5DEECE66Dn
const addend = 0xBn
const mask = (1n << 48n) - 1n

function initialScramble(seed) {
    return (seed ^ multiplier) & mask; //always positive, actually saved
}

class JavaRandom {
    constructor(seed) {
        this.seed = initialScramble(seed)
    }

    next(bits) { //: BigInt, bits: Number
        const nextseed = (this.seed * multiplier + addend) & mask;
        this.seed = nextseed
        //now 48 bits
        //return highest order n bits
        return (nextseed >> (48 - bits));
    }

    nextInt(bound) { //bound: BigInt
        if (bound <= 0n) throw new SyntaxError("invalid bound")
        //bound: up to 2^31-1
        
        let r = this.next(31); //random number 0 to 2^31-1
        let m = bound - 1n;
        if ((bound & m) == 0)  // i.e., bound is a power of 2
            r = ((bound * r) >> 31); // return (r << log(bound)) >> 31, or highest order log(bound) bits of r
        else {
            for (let u = r;
                u - (r = u % bound) + m < 0;
                u = next(31));
        }
        return r
    }
}
