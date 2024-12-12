import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Resume } from './entities/resume.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume)
    private resumeModel: typeof Resume,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadResume(user_id: string, file: Express.Multer.File) {
    const file_path = await this.cloudinaryService.uploadFile(file, user_id);
    const resume = await this.resumeModel.create({
      file_type: file.mimetype,
      user_id,
      file_path,
      status: 'uploaded',
      uploaded_at: new Date(),
    });
    return resume.id;
  }

  async checkStatus(resumeId: string) {
    const resume = await this.resumeModel.findOne({ where: { id: resumeId } });
    return resume.status;
  }
}
