export function stringToBoolean(value: string) {
	value = value.toLowerCase();
	return value === 'true' || value === '1' ? true : false;
}
