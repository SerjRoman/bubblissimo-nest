import { Prisma } from '../../generated/prisma/client';
import { PrismaErrorCodes } from '../types/prisma.types';

type ErrorMap = {
	[key in PrismaErrorCodes]?: Error;
};

export async function handlePrismaError<T>(
	prismaPromise: Promise<T>,
	errorMap: ErrorMap = {},
): Promise<T> {
	try {
		return await prismaPromise;
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			const customError = errorMap[error.code as PrismaErrorCodes];
			if (customError) {
				throw customError;
			}
		}
		throw error;
	}
}
