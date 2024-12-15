# Prisma example

- `npm init -y`

- `npm install typescript ts-node @types/node --save-dev`

- `npx tsc --init`

- `npm install prisma --save-dev`

- `npx prisma init --datasource-provider sqlite`

- `npm install @prisma/client --save-dev`

#### Após declarar o model no schema.prisma

- `npx prisma migrate dev --name init`

- `npx ts-node script.ts`
