do {
    define result = 10 / 0
    sldeploy result
} track {
    sldeploy "Handled division by zero"
}
