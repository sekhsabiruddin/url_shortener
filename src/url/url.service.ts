import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateShortCode } from './utils/generate-code.util';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async shortenUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    const { url, customCode } = createUrlDto;
    let shortCode = customCode || generateShortCode();

    // Ensure code is unique
    const existing = await this.urlModel.findOne({ shortCode });
    if (existing) throw new ConflictException('Custom code already in use');

    const newUrl = new this.urlModel({ originalUrl: url, shortCode });
    return newUrl.save();
  }

  async redirect(shortCode: string): Promise<string> {
    const urlDoc = await this.urlModel.findOne({ shortCode });
    if (!urlDoc) throw new NotFoundException('Short URL not found');

    urlDoc.clicks += 1;
    await urlDoc.save();
    return urlDoc.originalUrl;
  }

  async getStats(shortCode: string): Promise<Url> {
    const urlDoc = await this.urlModel.findOne({ shortCode });
    if (!urlDoc) throw new NotFoundException('No stats found for this code');
    return urlDoc;
  }
}
