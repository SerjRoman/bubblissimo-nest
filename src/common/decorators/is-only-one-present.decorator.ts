import { BadRequestException } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

interface IsOnlyOnePresentedOptions {
	optionalFields: string[];
}

export function IsOnlyOnePresent(
	options: IsOnlyOnePresentedOptions,
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	const { optionalFields } = options;

	return (target: object, propertyName: string) => {
		registerDecorator({
			name: 'isOnlyOnePresent',
			target: target.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(_, validationArguments) {
					const dto = validationArguments?.object;
					if (!dto) return false;
					const presentedFieldsCount = optionalFields.filter(
						(field) =>
							typeof dto[field] !== 'undefined' &&
							dto[field] !== null,
					).length;
					if (presentedFieldsCount > 1) {
						throw new BadRequestException(
							`Only one of the following fields is allowed: ${optionalFields.join(', ')}.`,
						);
					}
					return true;
				},

				defaultMessage() {
					return `Only one of the following fields is allowed: ${optionalFields.join(', ')}.`;
				},
			},
		});
	};
}
