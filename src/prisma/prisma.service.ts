import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';

import { pagination } from 'prisma-extension-pagination';

export type ExtendedPrismaClient = ReturnType<
	typeof createExtendedPrismaClient
>;

const createExtendedPrismaClient = () => {
	return new PrismaClient({
		omit: {
			user: {
				password: true,
			},
		},
	}).$extends(
		pagination({
			pages: {
				includePageCount: true,
			},
		}),
	);
};

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
	public readonly client: ExtendedPrismaClient;

	constructor() {
		this.client = createExtendedPrismaClient();
	}

	async onModuleInit() {
		await this.client.$connect();
	}

	async onModuleDestroy() {
		await this.client.$disconnect();
	}
}
