import { Controller, Post, Body } from '@nestjs/common';

@Controller('location')
export class LocationController {
  @Post()
  saveLocation(@Body() data: any) {
    // هنا تحفظ البيانات في Redis أو DB أو أي مكان
    console.log('Received location:', data);
    return { status: 'ok' };
  }
}
