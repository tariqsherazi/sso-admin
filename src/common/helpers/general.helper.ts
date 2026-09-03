/**
 * Generates a random hexa color string.
 *
 * Note: It will generate color without hash(#) like for blue color it will generate "1317EB" instead of "#1317EB"
 * @returns {string} A 6-character string representing a hexadecimal color code, e.g., "A3C4F4".
 */
export const generateHexColor = (): string => {
	let hexColor = "";
	for (let i = 0; i < 6; i++) {
		hexColor += Math.floor(Math.random() * 16).toString(16).toUpperCase();
	}
	return hexColor;
};

/**
 * Generates a URL for an avatar image based on the user's name, size, background color, and font size.
 *
 * @param {string} name - The name to be displayed on the avatar. It is URL-encoded by replacing spaces with `+`.
 * @param {number} [size=512] - The size of the avatar image in pixels. Defaults to 512.
 * @param {string} [backgroundColor=generateHexColor()] - The hexadecimal color code for the background of the avatar. Defaults to a randomly generated color.
 * @param {number} [fontSize=0.45] - The font size as a fraction of the image size. Defaults to 0.45 (45% of the image size).
 *
 * @returns {string} The URL string for the avatar image from the `ui-avatars.com` API.
 *
 * @example
 * const avatarUrl = generateAvatar('Hassan Ali', 256, 'FF5733', 0.5);
 * console.log(avatarUrl);
 * // e.g., "https://ui-avatars.com/api/?name=Hassan+Ali&size=256&background=FF5733&font-size=0.5"
 */

export const generateAvatar = (fullName: string, size = 12, backgroundColor: string = "6F61CF", fontSize: number = 700, color: string = "fff"): string => {

	return `https://ui-avatars.com/api/?name=${fullName.split(' ').join('+')}&size=${size}&background=${backgroundColor}&font-size=${fontSize}&color=${color}`;
}

export const generateUserAvatar = (fullName: string, size = 12, backgroundColor: string = "6F61CF", fontSize: number = 700, color: string = "fff"): string => {
	return `https://ui-avatars.com/api/?name=${fullName.split(' ').join('+')}&background=${backgroundColor}&color=${color}`;
}