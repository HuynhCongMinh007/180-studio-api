import { Project } from "@/modules/projects/domain/entities/project.entity";

export abstract class ProjectRepository {
    abstract findAllProjects(): Promise<Project[]>;
}