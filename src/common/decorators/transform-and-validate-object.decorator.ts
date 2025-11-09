import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

interface TransformAndValidateObjectOptions {
	allowedFields: string[];
	allowedOrders?: string[];
	delimiter?: string;
	parameterName?: string;
}

export function TransformAndValidateObject(
	options: TransformAndValidateObjectOptions,
): PropertyDecorator {
	const {
		allowedFields,
		allowedOrders = ['asc', 'desc'],
		delimiter = ':',
		parameterName,
	} = options;

	return Transform(({ value, key }: { value: string; key: string }) => {
		const paramName = parameterName || key;

		if (value === null || value === undefined || value === '') {
			return undefined;
		}

		if (typeof value !== 'string') {
			throw new BadRequestException(
				`The "${paramName}" parameter must be a string.`,
			);
		}

		const parts = value.split(delimiter);
		if (parts.length !== 2) {
			throw new BadRequestException(
				`The "${paramName}" parameter must be in the format "field${delimiter}order"`,
			);
		}

		const [field, order] = parts;

		if (!allowedFields.includes(field)) {
			throw new BadRequestException(
				`Sorting by "${field}" is not allowed for parameter "${paramName}". Allowed fields are: ${allowedFields.join(', ')}.`,
			);
		}

		if (!allowedOrders.includes(order)) {
			throw new BadRequestException(
				`Sort order "${order}" is not allowed for parameter "${paramName}". Allowed orders are: ${allowedOrders.join(', ')}.`,
			);
		}

		return { [field]: order };
	});
}
