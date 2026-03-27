# Break and continue example

for (let i = 0; i < 10; i = i + 1) {

    if (i == 2) {
        continue;
    }

    if (i == 6) {
        break;
    }

    sldeploy "i: " + i;
}
