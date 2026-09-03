import * as bcrypt from "bcrypt";

export class EncryptionHelper {
	private static defaultRounds = 5;

	public static async hash(str: string, rounds: number = this.defaultRounds): Promise<string> {
		const salt = await bcrypt.genSalt(rounds);
		return bcrypt.hash(str, salt);
	}

	public static async compareHash(str: string, hash: string): Promise<boolean> {
		return bcrypt.compare(str, hash);
	}

	public static randomNumberGenerator = (length: number = 6): number => {
		const numberGenerator: number = +"9".padEnd(length, "0");
		return Math.floor(Math.random() * numberGenerator);
	};

	public static addSalt(str: string): string {
		const randomSalt = this.randomNumberGenerator(4);
		return `${str}_${randomSalt}`;
	}
}
