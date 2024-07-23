export function checkFile(file: File) {
    return Math.floor(file.size / 1024) <= 200
}