# Simple expressions and evaluation

define a = 10;
define b = 5;

define result1 = a + b;
define result2 = a * b;
define result3 = (a + b) * 2;

sldeploy("Addition:");
sldeploy result1;

sldeploy("Multiplication:");
sldeploy result2;

sldeploy("Combined Expression:");
sldeploy result3;
