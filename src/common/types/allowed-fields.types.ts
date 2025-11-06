export interface SelectValidationRule {
	fields: string[];
	relations?: Record<string, SelectValidationRule>;
}

export interface IncludeValidationRule {
	relations: string[];
	nested?: Record<string, IncludeValidationRule>;
}
