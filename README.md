# REST API

> POST /jobs/:id

```json
{
  "title": "A job",
  "description": "Job Description"
}
```

> GET /jobs/:id

Returns

```json
{
  "id": 12343543,
  "title": "A job",
  "description": "Job Description"
}
```

> PUT /jobs/:id

Will replace the entire job object, with `id`, with the request body. (DOES NOT COMBINE)

```json
{
  "title": "New title",
  "description": "New Job Description"
}
```

> PATCH /jobs/:id

Will replace/create the given fields for job with `id`.

```json
{
  "otherField": "My other field"
}
```
