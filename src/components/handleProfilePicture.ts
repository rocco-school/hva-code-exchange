// Function to convert an image element to binary data
export async function imageToBinaryData(imageElement: HTMLImageElement): Promise<Uint8Array> {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    // Set canvas dimensions to match image
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw the image onto the canvas
    ctx?.drawImage(imageElement, 0, 0);

    // Get the binary data from the canvas
    const imageData: ImageData = ctx?.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
    return new Uint8Array(imageData.data.buffer);
}

// Function to convert binary data to an image element
export async function binaryDataToImage(binaryData: Iterable<number>, imageType: string): Promise<HTMLImageElement> {
    // Create a new Uint8Array and set the binary data
    const uint8Array: Uint8Array = new Uint8Array(binaryData);

    // Convert Uint8Array to base64 string
    const base64String: string = btoa(String.fromCharCode.apply(null, uint8Array));

    console.log(imageType);
    // Create a data URL
    const dataUrl: string = "data:" + imageType + ";base64," + base64String; // Adjust the type based on your image format

    console.log(dataUrl);


    // Create an image element
    const image: HTMLImageElement = document.createElement("img");

    // Set the image source to the data URL
    image.src = dataUrl;

    return image;
}
