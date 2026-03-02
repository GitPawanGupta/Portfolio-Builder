import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/env.js';

class LocalFileStorage {
  constructor() {
    this.uploadDir = config.storage.uploadDir;
  }

  async uploadFile(file, folder = 'resumes') {
    const folderPath = path.join(this.uploadDir, folder);
    await fs.mkdir(folderPath, { recursive: true });
    
    const filePath = path.join(folder, file.filename);
    return {
      url: `/uploads/${filePath}`,
      path: filePath,
    };
  }

  async getFileUrl(filePath) {
    return `/uploads/${filePath}`;
  }

  async deleteFile(filePath) {
    const fullPath = path.join(this.uploadDir, filePath);
    await fs.unlink(fullPath);
  }

  async downloadFile(filePath) {
    const fullPath = path.join(this.uploadDir, filePath);
    return await fs.readFile(fullPath);
  }
}

class S3FileStorage {
  constructor() {
    // AWS SDK v3 would be imported here if needed
    // For now, we'll use local storage as fallback
    console.warn('S3 storage not configured, using local storage');
    this.bucket = config.storage.aws.bucket;
  }

  async uploadFile(file, folder = 'resumes') {
    // Fallback to local storage
    const localStorage = new LocalFileStorage();
    return await localStorage.uploadFile(file, folder);
  }

  async getFileUrl(filePath) {
    const localStorage = new LocalFileStorage();
    return await localStorage.getFileUrl(filePath);
  }

  async deleteFile(filePath) {
    const localStorage = new LocalFileStorage();
    return await localStorage.deleteFile(filePath);
  }

  async downloadFile(filePath) {
    const localStorage = new LocalFileStorage();
    return await localStorage.downloadFile(filePath);
  }
}

// Factory function
export const getFileStorage = () => {
  if (config.storage.type === 's3') {
    return new S3FileStorage();
  }
  return new LocalFileStorage();
};
