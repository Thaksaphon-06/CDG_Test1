import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}

  // บันทึกข้อมูลใหม่ลง Database
  async create(createProjectDto: CreateProjectDto) {
    const newProject = this.projectsRepository.create(createProjectDto);
    const savedProject = await this.projectsRepository.save(newProject);
    
    return {
      message: 'บันทึกข้อมูลลงฐานข้อมูลเรียบร้อยแล้ว!',
      data: savedProject,
    };
  }

  // ดึงข้อมูลทั้งหมด
  async findAll() {
    return await this.projectsRepository.find({
      order: { createdAt: 'DESC' }, // เรียงจากใหม่ไปเก่า
    });
  }

  // ดึงข้อมูลรายตัวตาม ID
  async findOne(id: number) {
    const project = await this.projectsRepository.findOneBy({ id });
    if (!project) throw new NotFoundException(`ไม่พบโปรเจกต์ #${id}`);
    return project;
  }

  // อัปเดตข้อมูล
  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id); 
    const updatedProject = Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(updatedProject);
  }

  // ลบข้อมูล
  async remove(id: number) {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
    return { message: `ลบโปรเจกต์ #${id} สำเร็จแล้ว` };
  }
}