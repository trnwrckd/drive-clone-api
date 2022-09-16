# API for [Google-Drive-Clone](https://relaxed-kheer-00772d.netlify.app/)

## Models

```typescript
interface Ancestor {
  id: string
  name: string
}

interface Folder {
  _id?: any
  name: string
  type: string
  level: number
  ancestors: Ancestor[]
  parent?: string
}
```

## Endpoints

| Endpoint               | Description                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| GET /folderDetails/:id | returns folder object by matching id : Folder                                                    |
| GET /folders           | returns all folders : Folder[]                                                                   |
| GET /folders/:id       | returns childrens of folder.id : Folder[]                                                        |
| POST /folders          | inserts req.params.folder to collection                                                          |
| PUT /folders/:id       | updates "name" property of folder.id and updates ancestors.$.name if ancestors.$.id == folder.id |
| DELETE /folders/:id    | deletes "name" property of folder.id and deletes all folders f where f.parent == folder.id       |
