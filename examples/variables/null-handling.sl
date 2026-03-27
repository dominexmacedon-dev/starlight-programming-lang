# Handling null values

define value = null;

sldeploy("Initial value:");
sldeploy value;

define fallback = value ?? "Default Value";

sldeploy("After null coalescing:");
sldeploy fallback;
