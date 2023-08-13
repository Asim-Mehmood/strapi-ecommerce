export interface IImage {
  data: Array<{
    id: number;
    attributes: {
      alternativeText: string | null;
      caption: string | null;
      createdAt: string;
      ext: string;
      formats: {
        thumbnail: {
          ext: string;
          hash: string;
          height: number;
          mime: string;
          name: string;
          path: string | null;
          size: number;
          url: string;
          width: number;
        };
      };
      hash: string;
      height: number;
      mime: string;
      name: string;
      previewUrl: string | null;
      provider: string;
      provider_metadata: string | null;
      size: number;
      updatedAt: string;
      url: string;
      width: number;
    };
  }>;
}
