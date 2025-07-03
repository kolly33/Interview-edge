import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class ScreenshotService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async saveScreenshot(sessionId: string, screenshot: Buffer): Promise<string> {
    try {
      const fileName = `coding-session-${sessionId}-${Date.now()}.png`;
      return await this.cloudinaryService.uploadBuffer(screenshot, fileName);
    } catch (error) {
      throw new Error(`Failed to save screenshot: ${error.message}`);
    }
  }

  async deleteScreenshots(urls: string[]): Promise<void> {
    try {
      // Extract public IDs from Cloudinary URLs
      const publicIds = urls.map(url => {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        return fileName.split('.')[0]; // Remove file extension
      });

      await Promise.all(
        publicIds.map(publicId => this.cloudinaryService.delete(publicId))
      );
    } catch (error) {
      throw new Error(`Failed to delete screenshots: ${error.message}`);
    }
  }
}
