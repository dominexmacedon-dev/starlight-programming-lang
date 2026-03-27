define text = "   hello world from starlight   "

define cleaned = trim(lower(text))
define words = split(cleaned, " ")

define capitalized = map(words, (w) => capitalize(w))

sldeploy join(capitalized, "-")
