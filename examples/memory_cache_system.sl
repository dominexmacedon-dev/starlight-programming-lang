define cache = {}

func getCached(key, computeFn) {
    if (has(cache, key)) {
        return cache[key]
    }

    define value = computeFn()
    cache[key] = value
    return value
}

func expensive() {
    sldeploy "Computing..."
    return 42
}

sldeploy getCached("a", expensive)
sldeploy getCached("a", expensive)
