import { Inject, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: typeof v2) {}

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
