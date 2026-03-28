# Map, filter, reduce combined

define numbers = [1, 2, 3, 4, 5, 6];

define evens = filter(numbers, (x) => x % 2 == 0);
define doubled = map(evens, (x) => x * 2);
define sum = reduce(doubled, (acc, val) => acc + val, 0);

sldeploy "Evens: " + evens;
sldeploy "Doubled: " + doubled;
sldeploy "Sum: " + sum;
