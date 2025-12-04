import { readFileSync } from 'fs';
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const tsconfigRaw = readFileSync('./tsconfig.json', 'utf-8');

const { compilerOptions } = JSON.parse(tsconfigRaw);

export default async (): Promise<Config> => {
	return {
		verbose: true,
		moduleNameMapper: {
			...pathsToModuleNameMapper(compilerOptions.paths, {
				prefix: '<rootDir>/',
			}),
			'^(\\.{1,2}/.*)\\.js$': '$1',
		},
		clearMocks: true,
		testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
		preset: 'ts-jest',
		testPathIgnorePatterns: ['/factories/'],
		transform: {
			'^.+\\.tsx?$': [
				'ts-jest',
				{
					useESM: true,
					tsconfig: 'tsconfig.json',
				},
			],
		},
	};
};
