import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    LocationModule,
    // باقي الموديولات
  ],
})
export class AppModule {}
