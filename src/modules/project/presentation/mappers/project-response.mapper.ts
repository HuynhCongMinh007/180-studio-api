import { Project } from "@/modules/project/domain/entities/project.entity";
import {
    ProjectImageResponse,
    ProjectResponse,
} from "@/modules/project/presentation/dtos/project.response.dto";

export function toProjectResponse(project: Project): ProjectResponse {
    const projectImages: ProjectImageResponse[] = [];
    
    for (const projectImage of project.projectImages) {
        const projectImageResponse: ProjectImageResponse = {
            imageUrl: projectImage.imageUrl,
            coverPriority: projectImage.coverPriority,
        };
        projectImages.push(projectImageResponse);
    }

    const projectResponse: ProjectResponse = {
        id: project.id,
        name: project.name,
        year: project.year,
        location: project.location,
        siteArea: project.siteArea,
        floorArea: project.floorArea,
        client: project.client,
        photographer: project.photographer,
        videoUrl: project.videoUrl,
        projectImages: projectImages,
    };
    return projectResponse;
}
