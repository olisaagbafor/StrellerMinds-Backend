import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dtos/create.course.dto';
import { UpdateCourseDto } from './dtos/update.course.dto';
  
  
  @Injectable()
  export class CourseService {
    constructor(
      @InjectRepository(Course)
      private readonly courseRepository: Repository<Course>,
    ) {}
  
    public async create(createCourseDto: CreateCourseDto): Promise<Course> {
      try {
        const course = this.courseRepository.create(createCourseDto);
        return await this.courseRepository.save(course);
      } catch (error) {
        throw new InternalServerErrorException('Error creating course');
      }
    }
  
    public async findAll(): Promise<Course[]> {
      try {
        return await this.courseRepository.find();
      } catch (error) {
        throw new InternalServerErrorException('Error fetching courses');
      }
    }
  
    public async findOne(id: string): Promise<Course> {
      try {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) {
          throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
      } catch (error) {
        throw new InternalServerErrorException('Error fetching course');
      }
    }
  
    public async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
      try {
        await this.findOne(id); 
        await this.courseRepository.update(id, updateCourseDto);
        return await this.findOne(id);
      } catch (error) {
        throw new InternalServerErrorException('Error updating course');
      }
    }
  
    public async delete(id: string): Promise<void> {
      try {
        const result = await this.courseRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Course with ID ${id} not found`);
        }
      } catch (error) {
        throw new InternalServerErrorException('Error deleting course');
      }
    }
  }
  