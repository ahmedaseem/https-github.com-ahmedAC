import { Module } from '@nestjs/common';
import { TestApiModule } from './test-api/test-api.module.js';
import { LocationModule } from './location/location.module.js';

@Module({
  imports: [
    TestApiModule,
    LocationModule,
  ],
})
export class AppModule {}
