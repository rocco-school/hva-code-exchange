/**
 * Converts a File object to a base64-encoded string asynchronously.
 * @param file - The File object to be converted.
 * @returns A Promise that resolves to the base64-encoded string.
 */
async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject): void => {
        const reader: FileReader = new FileReader();

        // Event handler for when the file is successfully read
        reader.onload = function (): void {
            const base64String: string = reader.result?.toString().split(",")[1] || "";
            resolve(base64String);
        };

        // Event handler for errors during file reading
        reader.onerror = function (): void {
            reject(new Error("Failed to read the file."));
        };

        // Start reading the file as a data URL
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a base64-encoded string to an image source string.
 * @param base64String - The base64-encoded string.
 * @returns The image source string.
 */
function convertBase64ToImageSrc(base64String: string): string {
    return "data:image/png;base64," + base64String;
}


/**
 * Converts a base64-encoded string to a Uint8Array (binary data).
 * @param base64String - The base64-encoded string.
 * @returns The Uint8Array representing the binary data.
 */
function convertBase64ToBinary(base64String: string): Uint8Array {
    const binaryString: string = atob(base64String);
    const length: number = binaryString.length;
    const binaryArray: Uint8Array = new Uint8Array(length);

    for (let i: number = 0; i < length; i++) {
        binaryArray[i] = binaryString.charCodeAt(i);
    }

    return binaryArray;
}


/**
 * Converts a Uint8Array (binary data) to a base64-encoded string.
 * @param binaryData - The Uint8Array representing the binary data.
 * @returns The base64-encoded string.
 */
function convertBinaryToBase64(binaryData: Uint8Array): string {
    let base64String: string = "";
    const length: number = binaryData.length;

    for (let i: number = 0; i < length; i++) {
        base64String += String.fromCharCode(binaryData[i]);
    }

    return btoa(base64String);
}


/**
 * Converts a Uint8Array (binary data) to an image source string.
 * @param binaryData - The Uint8Array representing the binary data.
 * @returns The image source string.
 * @throws Throws an error if the conversion fails.
 */
export function convertBinaryToImageSrc(binaryData: Uint8Array): string {
    const base64String: string = convertBinaryToBase64(binaryData);

    if (!base64String) {
        throw new Error("Conversion binary to base64 failed.");
    }

    return convertBase64ToImageSrc(base64String);
}

/**
 * Converts a File object to a Uint8Array (binary data) asynchronously.
 * @param selectedFile - The File object to be converted.
 * @returns A Promise that resolves to the Uint8Array representing the binary data.
 * @throws Throws an error if the conversion fails.
 */
export async function convertImageToBinary(selectedFile: File): Promise<Uint8Array> {
    const base64String: string = await convertImageToBase64(selectedFile);

    const binaryData: Uint8Array = convertBase64ToBinary(base64String);

    if (!binaryData) {
        throw new Error("Conversion base64 to binary failed.");
    }

    return binaryData;
}


export function uint8ArrayToBlob(array: Uint8Array): Blob {
    return new Blob([array]);
}
