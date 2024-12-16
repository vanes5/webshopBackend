import { Body, Controller, Get, Param, Patch, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Request, Response } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { AuthGuard } from './Auth-guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/products')
  async getAll() {
    return await this.appService.getAll()
  }

  @Post('/login')
  async login(@Body() CreateProfileDto: CreateProfileDto, @Req() req: any){
    return await this.appService.login(CreateProfileDto, req.session);
  }

  @Post('/register')
  async register(@Body() CreateProfileDto: CreateProfileDto, @Req() req: any){
    return await this.appService.register(CreateProfileDto, req.session);
  }
  @Patch('/editprofile')
  async updateProfile(@Req() req: Request, @Res() res: Response) {
  const { username, password } = req.body;

  if (!req.session.user) {
    return res.status(400).json({ message: 'User not authenticated' });
  }

  try {
    const updatedUser = { username: username || req.session.user.username, password: password || req.session.user.password };
    req.session.user = updatedUser; // Update session
    return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error
    return res.status(500).json({ message: 'Failed to update profile', error: error.message }); // Send error message back
  }
}

  @Get('profile')
  async profile(@Req() req: any){
    console.log('Request Session:', req.session); 
    try {
      const profile = await this.appService.Profile(req.session);
      return profile;
    } catch (error) { 
      return { error: error.message };
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.status(200).json({ message: 'Successfully logged out' });
    });
  };
  
  @Get('check-auth')
  @UseGuards(AuthGuard)  // Use the AuthGuard to ensure the user is authenticated
  checkAuthStatus(@Req() req: Request) {
    return { user: req.session.user };  // Return the user info if authenticated
  }
}
