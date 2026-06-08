export class CreateNoticeDto {
  title: string;
  summary?: string;
  content: string;
  type?: string;
  tags?: string[];
  coverImage?: string;
  active?: boolean;
}

export class UpdateNoticeDto {
  title?: string;
  summary?: string;
  content?: string;
  type?: string;
  tags?: string[];
  coverImage?: string;
  active?: boolean;
}
