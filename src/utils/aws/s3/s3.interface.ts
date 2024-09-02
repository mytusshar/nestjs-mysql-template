export interface IGetFileUploadUrl {
    s3FilePath: string;
    contentType?: string;
}

export interface IGetFileDownloadUrl {
    s3FilePath: string;
}

export interface IReadFile {
    s3FilePath: string;
}

export interface IWriteFile {
    s3FilePath: string;
    data: any;
    contentType?: 'application/pdf' | 'application/json' | 'application/txt';
}
