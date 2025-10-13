import {WeightedRandomRarity} from "./Random.js";
import {jsonEncode, CounterItems} from "./index.js";

const random = new WeightedRandomRarity({
    'Common': 55,
    'Uncommon': 24,
    'Rare': 15,
    'Ultra-Rare': 5,
    'Legendary': 1,
}), odds = random.getOdds().asPercents;
const itemCounter = new CounterItems();
itemCounter.set0('Common').set0('Uncommon').set0('Rare').set0('Ultra-Rare').set0('Legendary');
let last = 'unknown';
for (let i = 0; i < 100; i++) {
    itemCounter.add(last = random.next());
}

console.log(jsonEncode({itemCounter, odds, last}, true));
