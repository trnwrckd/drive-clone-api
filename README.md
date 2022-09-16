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

1. GET /folders - returns all folders : Folder[]
2. GET /folders/:id - returns childrens of folder.id : Folder[]
3. POST /folders - inserts req.params.folder to collection
4. PUT /folders/:id - updates "name" property of folder.id  
   and updates ancestors.$.name if ancestors.$.id == folder.id
5. DELETE /folders/:id - deletes "name" property of folder.id  
   and deletes all folders f where f.parent == folder.id
6. GET /folderDetails/:id returns folder object by matching id : Folder
