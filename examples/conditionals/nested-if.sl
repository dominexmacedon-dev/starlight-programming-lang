# Nested if statements

define age = 25;
define hasID = true;

if (age >= 18) {
    if (hasID) {
        sldeploy("Access granted");
    } else {
        sldeploy("ID required");
    }
} else {
    sldeploy("Underage");
}
