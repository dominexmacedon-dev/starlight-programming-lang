# Null coalescing operator

define value1 = null;
define value2 = "Fallback";

define result = value1 ?? value2;

sldeploy "Result: " + result;
