import {utils} from 'ethers';


export const readFile = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

export const hashFileToBytes32 = async (file: File): Promise<string> => {
    try {
        const fileData = await readFile(file);

        const buffer = Buffer.from(fileData);
        const hash = utils.keccak256(buffer);

        return '0x' + hash.substring(2);
    } catch (error) {
        console.error('Error hashing file:', error);
        throw error;
    }
};