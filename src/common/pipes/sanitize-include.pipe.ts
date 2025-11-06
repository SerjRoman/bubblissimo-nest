import type { IncludeValidationRule } from '@common/types/allowed-fields.types';
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SanitizeIncludePipe implements PipeTransform {
	constructor(private readonly rules: IncludeValidationRule) {}

	transform(value: Record<string, unknown>) {
		if (!value || typeof value !== 'object') {
			return undefined;
		}
		return this.sanitize(value, this.rules);
	}

	private sanitize(
		includeObj: Record<string, unknown>,
		rule: IncludeValidationRule,
	): Record<string, string> {
		const sanitized = {};

		for (const key of Object.keys(includeObj)) {
			if (!rule.relations.includes(key)) {
				continue;
			}

			const includeValue = includeObj[key];

			if (includeValue === true) {
				sanitized[key] = true;
			} else if (
				typeof includeValue === 'object' &&
				includeValue !== null &&
				rule.nested?.[key] &&
				'include' in includeValue
			) {
				const nestedInclude = includeValue.include as Record<
					string,
					unknown
				>;
				if (nestedInclude) {
					sanitized[key] = {
						include: this.sanitize(nestedInclude, rule.nested[key]),
					};
				}
			}
		}
		return sanitized;
	}
}
