import { isHttpsUrl } from "../../../../lib/utils"
import { InvalidProjectImageError } from "../errors/project-image.errors"

export interface ProjectImageProps {
    imageUrl: string
    coverPriority: number | null
}
export class ProjectImage {
    private readonly _imageUrl: string
    private readonly _coverPriority: number | null

    private constructor(props: ProjectImageProps) {
        this._imageUrl = props.imageUrl
        this._coverPriority = props.coverPriority
    }
    get imageUrl(): string {
        return this._imageUrl
    }

    get coverPriority(): number | null {
        return this._coverPriority
    }

    static create(props: ProjectImageProps): ProjectImage {
        if (!isHttpsUrl(props.imageUrl)) {
            throw new InvalidProjectImageError("imageUrl must be a valid HTTPS URL")
        }
        if (props.coverPriority !== null) {
            if (!Number.isInteger(props.coverPriority) || props.coverPriority < 0) {
                throw new InvalidProjectImageError("coverPriority must be null or an integer that is 0 or more")
            }
        }
        return new ProjectImage(props)
    }
}
