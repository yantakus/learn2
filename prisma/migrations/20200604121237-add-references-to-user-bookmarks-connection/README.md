# Migration `20200604121237-add-references-to-user-bookmarks-connection`

This migration has been generated by Yan Takushevich at 6/4/2020, 12:12:37 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200604094302-remove-vote-counts..20200604121237-add-references-to-user-bookmarks-connection
--- datamodel.dml
+++ datamodel.dml
@@ -4,9 +4,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 model Video {
   ytId        String     @id
@@ -18,17 +18,17 @@
   tags        Tag[]      @relation(references: [id])
   votes       Vote[]
   uploader    User       @relation("UserVideos", fields: [uploaderId], references: [uid])
   uploaderId  String
-  bookmarkers User[]     @relation("UserBookmarks")
+  bookmarkers User[]     @relation("UserBookmarks", references: [uid])
   language    Language   @relation(fields: [languageId], references: [id])
   languageId  Int
 }
 model User {
   uid       String  @id
   videos    Video[] @relation("UserVideos")
-  bookmarks Video[] @relation("UserBookmarks")
+  bookmarks Video[] @relation("UserBookmarks", references: [ytId])
   votes     Vote[]
 }
 model Vote {
```


