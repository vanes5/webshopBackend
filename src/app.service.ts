import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import * as bcrypt from 'bcrypt';
import { ne } from '@faker-js/faker/.';

@Injectable()
export class AppService {
  constructor(private readonly db: PrismaService){}
  async Profile(session: any){
    console.log('Session:', session);
    if (!session || !session.user) {
      throw new Error("Invalid session or user not authenticated.");
    }
    const user = await this.db.profile.findUnique({
      where: { username: session.user.username },
      select: {
        username: true,
        password: true,
      },
    });
    console.log('Fetched user:', user);
    if (!user) {
      throw new Error("User not found.");
    }
  
    return {
      user
    };
  }

  async getAll(){
    return await this.db.sutemeny.findMany();
  }
  async updateProfile(currentUsername: string, currentPassword: string, newUsername: string, newPassword: string) {
    try {
      let newPass = "";
      const saltRounds = 10;
      const user = await this.db.profile.findUnique({
        where: { username: currentUsername },
      });
  
      if (!user) {
        throw new Error('User not found');
      }

      if(currentPassword != newPassword){
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
          throw new HttpException('Password must be at least 6 characters long and contain at least one number, one lowercase letter, and one uppercase letter.', HttpStatus.BAD_REQUEST);
        }
        newPass = await bcrypt.hash(newPassword, saltRounds)
      }
      else{
        newPass = currentPassword;
      }
      if(currentUsername != newUsername){
        if (await this.db.profile.findUnique({ where: { username: newUsername } })) {
          throw new Error("Username already exists");
        }
      }
  
  
      const updatedUser = await this.db.profile.update({
        where: { username: currentUsername },
        data: {
          username: newUsername || user.username,
          password: newPass,
        },
      });
  
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
  

  
  async login(CreateProfileDto: CreateProfileDto, session: any){
    const user = await this.db.profile.findUnique({
      where: { username: CreateProfileDto.username },
    });

    if (!user) {
      throw new HttpException(
        'Nem megfelelő felhasználónév.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordValid = await bcrypt.compare(CreateProfileDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new HttpException(
        'Nem megfelelő jelszó.',
        HttpStatus.BAD_REQUEST,
      );
    }
    session.user = {
      username: user.username,
      password: user.password,
    };

    return { message: 'Login successful', user: session.user };
  }

  async register(CreateProfiledto: CreateProfileDto, session: any){
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(CreateProfiledto.password, saltRounds);
      const existingUser = await this.db.profile.findUnique({
        where: {username: CreateProfiledto.username }, 
      });
      if (existingUser) {
        throw new HttpException('Username already taken', HttpStatus.BAD_REQUEST,);
      }

      if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(CreateProfiledto.password)){
        throw new HttpException('Minimum 6 karakter hosszúnak kell lennie és tartalmazni kell legalább egy számot, kis betűt és nagy betűt.', HttpStatus.BAD_REQUEST,)
      }

      const newUser = await this.db.profile.create({
        data: {
          ...CreateProfiledto,
          password: hashedPassword,
        }
      });

      session.user = {
        username: newUser.username,
        password: newUser.password
      };
      return { message: 'Registration successful', user: session.user };
  }
}
