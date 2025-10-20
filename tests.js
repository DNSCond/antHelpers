import {parseColorString} from "./index.js";

// import {WeightedRandomRarity} from "./Random.js";
// import {jsonEncode, CounterItems} from "./index.js";
//
// const random = new WeightedRandomRarity({
//     'Common': 55,
//     'Uncommon': 24,
//     'Rare': 15,
//     'Ultra-Rare': 5,
//     'Legendary': 1,
// }), odds = random.getOdds().asPercents;
// const itemCounter = new CounterItems();
// itemCounter.set0('Common').set0('Uncommon').set0('Rare').set0('Ultra-Rare').set0('Legendary');
// let last = 'unknown';
// for (let i = 0; i < 100; i++) {
//     itemCounter.add(last = random.next());
// }
//
// console.log(jsonEncode({itemCounter, odds, last}, true));

console.log(parseColorString("#00a8f3; #8cfffa;#fff100;#ff4500;#fea700;#fee1b9;#00ff00;#00a8f3;#0073a6;#00587f;#004665;#002d40;#ff4500;#a62c00;#7e2100;#651a00;#401100;#fff100;#a68300;#7e6400;#655000;#403c00;#00ff00;#00a600;#007e00;#006500;#004000;#ff00ff;#a600a6;#7e007e;#650065;#400040;#00ffff;#00a6a6;#007e7e;#006565;#004040;#fea700;#a66d00;#7e5300;#654200;#aeef0f;#7aa60a;#5d7f08;#4a6506;#2f4004;#40bf55;#38a648;#2b7f37;#22652c;#15401c;#8e46db;#6a35a6;#51297f;#402065;#291440;#758eb1;#fefefe;#272727;#fdf5d9;#00bf00;#009500;#0f0f0f;#000000;#fce5bb;#c77f08;#1f1f1f;#151515;#005100;#004000;#ffffff;#f5749d;#f30083;#fee1b9;#0072f3;#004fa9;#616161;#00f331;#ff4500;#87ceeb;#99ffff;#cbffff;#191970;#fe57e8;#35cf38;#5bcffb;#3c8aa6;#2e697f;#255465;#173540;#f5abb9;#a6747d;#7f5960;#65464c;#402d30;#fe8125;#ad0512;#fa5511;").map(String))

console.log(parseColorString("#00a8f3;#8cfffa#ad0512;#fa5511;").map(String))
