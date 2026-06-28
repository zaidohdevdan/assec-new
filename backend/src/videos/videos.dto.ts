export class CreateVideoDto {
  title: string;
  youtubeUrl: string;
  active?: boolean;
}

export class UpdateVideoDto {
  title?: string;
  youtubeUrl?: string;
  active?: boolean;
}
