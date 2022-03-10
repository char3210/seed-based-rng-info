let currseed = 0n
let gold = 1

const seedinput = document.getElementById("seed")
const goldinput = document.getElementById("goldinput")
const goldslider = document.getElementById("goldslider")
const itemsout = document.getElementById("items")

let entries

seedinput.addEventListener('input', () => {
    const tempseed = parseLong(seedinput.value)
    if (tempseed == null) {
        return
    }

    currseed = tempseed
    refreshSeed()
})

goldinput.addEventListener('input', () => {
    const tempgold = parseInt(goldinput.value)
    if (isNaN(tempgold) || tempgold > 500 || tempgold < 1) {
        return
    }

    gold = tempgold
    goldslider.value = Math.min(Math.max(gold, goldslider.min), goldslider.max);
    refreshGold()
})

goldslider.addEventListener('input', () => {
    const tempgold = parseInt(goldslider.value)
    if (isNaN(tempgold) || tempgold > 500 || tempgold < 1) {
        return
    }

    gold = tempgold
    goldinput.value = goldslider.value
    refreshGold()
})

async function load() {
    const response = await fetch('piglin_bartering.json')
    const bartering_table = await response.json()
    entries = bartering_table["pools"][0]["entries"]
    for (entry of entries) {
        entry["weight"] = BigInt(entry["weight"])
    }
}

function refreshSeed() {
    document.getElementById("text").textContent = "Seed: " + currseed

    refreshGold()
}

function refreshGold() { 
    const goldrandom = new JavaRandom(currseed)
    const res = {}

    for (let i=0; i < gold; i++) {
        const nextBarter = getNextBarter(goldrandom)
        add(res, nextBarter.item, nextBarter.amount)
    }

    itemsout.innerHTML = ''
    for (item in res) {
        const row = document.createElement('tr')
        const itemdisp = document.createElement('td')
        const amountdisp = document.createElement('td')
        itemdisp.innerText = item
        amountdisp.innerText = res[item]
        row.appendChild(itemdisp)
        row.appendChild(amountdisp)
        itemsout.appendChild(row)
    }
}

function getNextBarter(random) {
    const res = {}
    let j = random.nextInt(423n)
    for (entry of entries) {
        if ((j -= entry['weight']) >= 0) continue;
        let amount = getAmount(entry, random)
        return {'item': entry.name, 'amount': amount}
    }
    return res
}

function getAmount(entry, random) {
    let amount = 1
    const functions = entry.functions
    if (functions != null) {
        for (f of functions) {
            if (f.function == "minecraft:set_count") {
                amount = helperNextInt(random, BigInt(f.count.min), BigInt(f.count.max)) //UniformLootTableRange.java:50
            } else if(f.function == "minecraft:enchant_randomly") {
                random.nextInt(1n) //EnchantRandomlyLootFunction.java:68
                helperNextInt(random, 1n, 3n) //EnchantRandomlyLootFunction.java:74 soul speed is 1 to 3
            }
        }
    }
    return amount
}

function add(object, key, value) {
    if (key in object) {
        object[key] += value
    } else {
        object[key] = value
    }
}

function helperNextInt(random, min, max) {
    if (min >= max) {
        return min
    }
    return random.nextInt(max - min + 1n) + min
}

function parseLong(str) {
    if (str.length > 22) {
        return null
    }
    let res
    try {
        res = BigInt(str)
    } catch (ignored) {
        return null
    }
    if (res > (2n**63n - 1n) || res < (2n**63n * -1n)) {
        return null
    }
    return res
}

load()