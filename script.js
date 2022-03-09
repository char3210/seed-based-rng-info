let currseed = 0n
let gold = 1

const seedinput = document.getElementById("seed")
const goldinput = document.getElementById("gold")
const itemsout = document.getElementById("items")

let bartering_table

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
    refreshGold()
})

async function load() {
    const response = await fetch('https://raw.githubusercontent.com/qwertyuioplkjhgfd/seed-cycle-info/main/piglin_bartering.json')
    bartering_table = await response.json()
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
    const entries = bartering_table["pools"]["entries"]
    console.log(entries)
}

function add(object, key, value) {
    if (key in object) {
        object[key] += value
    } else {
        object[key] = value
    }
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
