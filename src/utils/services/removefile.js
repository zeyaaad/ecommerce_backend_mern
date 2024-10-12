import fs from 'fs';
import path from 'path';

export async function removeImage(folder, filename) {
    try {
        const filePath = path.join(process.cwd(), `uploads/${folder}/${filename}`);
        await fs.promises.unlink(filePath);  
    } catch (err) {
        console.error("Failed to remove image:", err);
    }
}
