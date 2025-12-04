import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom, ClassroomStudent, ClassroomTeacher } from './entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Classroom,
			ClassroomStudent,
			ClassroomTeacher,
		]),
	],
})
export class ClassroomModule {}
