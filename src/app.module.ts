import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import * as session from 'express-session';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'secretkey',
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false },
        }),
        (req, res, next) => {
          console.log("Session middleware:", req.session);
          next();
        },
      )
      .forRoutes('*'); 
  }
}
