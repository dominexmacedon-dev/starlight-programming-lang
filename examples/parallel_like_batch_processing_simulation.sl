define jobs = range(1, 5)

func process(job) {
    return job * job
}

define results = map(jobs, (j) => process(j))

sldeploy results
