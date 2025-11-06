import { PipeTransform, Injectable } from '@nestjs/common';
import type { SelectValidationRule } from '../types/allowed-fields.types';

@Injectable()
export class SanitizeSelectPipe implements PipeTransform {
	constructor(private readonly rules: SelectValidationRule) {}

	transform(value: Record<string, unknown>) {
		if (!value || typeof value !== 'object') {
			return undefined;
		}
		return this.sanitize(value, this.rules);
	}

	private sanitize(
		selectObj: Record<string, unknown>,
		rule: SelectValidationRule,
	): Record<string, string> {
		const sanitized = {};

		for (const key of Object.keys(selectObj)) {
			if (!rule.fields.includes(key)) {
				continue;
			}

			const fieldValue = selectObj[key];

			if (
				typeof fieldValue === 'object' &&
				fieldValue !== null &&
				rule.relations?.[key] &&
				'select' in fieldValue
			) {
				const nestedSelect = fieldValue.select as Record<
					string,
					unknown
				>;
				if (nestedSelect) {
					sanitized[key] = {
						select: this.sanitize(
							nestedSelect,
							rule.relations[key],
						),
					};
				}
			} else if (fieldValue === true) {
				sanitized[key] = true;
			}
		}
		return sanitized;
	}
}
