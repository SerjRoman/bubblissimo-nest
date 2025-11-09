import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

interface TransformAndValidateOptions {
	allowedValues: string[];
	parameterName: string;
}

export function TransformAndValidateArray(
	options: TransformAndValidateOptions,
): PropertyDecorator {
	const { allowedValues, parameterName } = options;

	return Transform(
		({ value, key }: { value: string | string[]; key: string }) => {
            console.log(value, key)
			const paramName = parameterName || key;

			if (value === null || value === undefined || value === '') {
				return undefined;
			}

			let keys: string[];
			if (typeof value === 'string') {
				keys = value
					.split(',')
					.map((k) => k.trim())
					.filter(Boolean);
			} else if (Array.isArray(value)) {
				keys = value.map(String);
			} else {
				throw new BadRequestException(
					`The "${paramName}" parameter must be a comma-separated string or an array of strings.`,
				);
			}

			if (keys.length === 0) {
				return undefined;
			}

			const resultObject: Record<string, true> = {};
			const allowedSet = new Set(allowedValues);

			for (const k of keys) {
				if (!allowedSet.has(k)) {
					throw new BadRequestException(
						`Invalid value for "${paramName}": "${k}". Allowed values are: ${allowedValues.join(', ')}.`,
					);
				}
				resultObject[k] = true;
			}

			return resultObject;
		},
	);
}
