# Array & Slice Demo 32

define arr = [32, 33, 34, 35, 36, 37, 38];

sldeploy "---- Example 32 ----";

sldeploy "Original Array: " + arr;

define firstHalf = arr[0:3];
sldeploy "First Half (0:3): " + firstHalf;

define middle = arr[2:5];
sldeploy "Middle (2:5): " + middle;

define stepSlice = arr[0:7:2];
sldeploy "Step Slice (0:7:2): " + stepSlice;

define lastPart = arr[3:7];
sldeploy "Last Part (3:7): " + lastPart;
