# Dynamic property keys

define key = "score";

define obj = {};
obj[key] = 95;

sldeploy "Score: " + obj.score;
