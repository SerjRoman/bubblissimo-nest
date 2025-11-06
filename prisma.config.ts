import 'dotenv/config';
import path from 'path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: path.join(__dirname, 'prisma'),
	migrations: {
		path: path.join('db', 'migrations'),
		seed: 'ts-node -r tsconfig-paths/register ./src/prisma/seed.ts',
	},
});
