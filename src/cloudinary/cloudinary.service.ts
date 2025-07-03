import { Inject, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: typeof v2) {}

  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    options: {
      folder?: string;
      resource_type?: 'auto' | 'image' | 'video' | 'raw';
      public_id?: string;
    } = {}
  ): Promise<any> {
    try {
      const b64 = buffer.toString('base64');
      const dataUri = 'data:image/png;base64,' + b64;

      const response = await this.cloudinary.uploader.upload(dataUri, {
        resource_type: options.resource_type || 'auto',
        folder: options.folder || 'coding-screenshots',
        public_id: options.public_id || fileName.split('.')[0],
      });
      return response.secure_url;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async delete(publicId: string): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }

  async uploadFile(file: Express.Multer.File, user_id: string) {
    try {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const imageFilePath = 'data:' + file.mimetype + ';base64,' + b64;

      const response = await this.cloudinary.uploader.upload(imageFilePath, {
        resource_type: 'auto',
        folder: 'resume',
        public_id: user_id,
      });
      return response.secure_url;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
}
