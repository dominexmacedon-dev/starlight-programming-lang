# Flatten nested arrays

define nested = [1, [2, 3], [4, [5, 6]]];

func flatten(arr) {
    define result = [];

    for item in arr {
        if (typeOf(item) == "array") {
            define inner = flatten(item);

            for i in inner {
                push(result, i);
            }
        } else {
            push(result, item);
        }
    }

    return result;
}

define flat = flatten(nested);

sldeploy "Flattened: " + flat;
