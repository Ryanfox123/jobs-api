// @ts-nocheck
import express from "express";
import jobs from "./jobs";
const app = express();

// req.body is a string
// HOWEVER, if you send a header, with "Content-Type": "application/json" and "Accept": "application/json"
// It will parse the string into JSON
app.use(express.json());

const port = 3000;

app.get("/jobs/:id", (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;

  const job = jobs[Number(id)];
  if (job) {
    return res.json(job);
  } else {
    return res.json({ message: "Job not found" });
  }
});

app.get("/jobs", (req, res) => {
  return res.json(jobs);
});

type CreatedJob = {
  job: Record<string, unknown>;
  error: boolean;
  errorMessage: string;
};

const createJob = (body: Record<string, unknown>): CreatedJob => {
  const createdJob = {
    job: body,
    error: false,
    errorMessage: "",
  };

  if (body.id) {
    createdJob.error = true;
    createdJob.errorMessage = "User cannot choose their own ID";
    return createdJob;
  }
  if (!body.title) {
    createdJob.error = true;
    createdJob.errorMessage = "User must choose a title";
    return createdJob;
  }

  let id = 0;
  let match = true;

  while (match) {
    id = Math.floor(Math.random() * 1_000_000_000_000);
    // jobs has  1_000_000 elements
    if (!jobs[id]) {
      match = false;
    }
  }
  createdJob.job.id = id;
  return createdJob;
};

app.post("/jobs", (req, res) => {
  const createdJob = createJob(req.body);

  if (createdJob.error) {
    return res.status(400).json({ message: createdJob.errorMessage });
  }

  // createdJob.job.id e.g, 12312421, set that value equal to the job data
  // @ts-ignore
  jobs[createdJob.job.id] = createdJob.job;

  return res.status(201).json({ message: "Job Created", job: createdJob.job });
});

app.delete("/jobs/:id", (req, res) => {
  const id = req.params.id;
  const job = jobs[Number(id)];
  if (!job) {
    return res.status(404).json({ message: "Job does exist" });
  }
  delete jobs[Number(id)];
  return res.status(204).send();
});

app.put("/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const job = jobs[id];

  // job exists
  if (job) {
    jobs[id] = { ...req.body, id };

    // return status code 200, with no body.
    return res.status(200).send();
  }

  return res.status(404).json({ message: "Cannot update job does not exist" });
});

app.patch("/jobs/:id", (req, res) => {
  const id = Number(req.params.id);
  const job = jobs[id];
  if (job) {
    // delete the id if the user has provided their own
    delete req.body.id;
    jobs[id] = { ...job, ...req.body };
    return res.send(204).send();
  }
  return res.send(422).json({ message: "Cannot modify" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
