import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('URL Shortener')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/shorten')
  @ApiResponse({ status: 201, description: 'URL shortened successfully' })
  async shorten(@Body() createUrlDto: CreateUrlDto) {
    const result = await this.urlService.shortenUrl(createUrlDto);
    return {
      originalUrl: result.originalUrl,
      shortUrl: `${process.env.BASE_URL}/r/${result.shortCode}`,
    };
  }

  @Get('r/:shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const originalUrl = await this.urlService.redirect(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }

  @Get('api/stats/:shortCode')
  async getStats(@Param('shortCode') shortCode: string) {
    const stats = await this.urlService.getStats(shortCode);
    return {
      originalUrl: stats.originalUrl,
      shortUrl: `${process.env.BASE_URL}/r/${stats.shortCode}`,
      clicks: stats.clicks,
    };
  }
}
