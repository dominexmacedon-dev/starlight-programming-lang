define nums = range(1, 20)

define processed = map(
    filter(nums, (x) => x % 2 == 1),
    (x) => x * 3
)

sldeploy processed
