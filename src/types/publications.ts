export interface PublicationLink {
  label: string;
  url: string;
}

export interface Publication {
  title: string;
  authors: string;
  year: number | string;
  venue: string;
  comment?: string;
  link: string;
  links?: PublicationLink[];
  featured: boolean;
}

export interface PublicationsType {
  authorName: string;
  items: Publication[];
}
