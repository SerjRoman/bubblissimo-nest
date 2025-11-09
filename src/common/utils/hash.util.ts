import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class HashUtil {
	private readonly saltRounds = 10;

	async hash(plainText: string): Promise<string> {
		return bcryptjs.hash(plainText, this.saltRounds);
	}

	async compare(plainText: string, hash: string): Promise<boolean> {
		return bcryptjs.compare(plainText, hash);
	}
}
