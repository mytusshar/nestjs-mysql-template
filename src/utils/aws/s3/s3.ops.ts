import { BadRequestException, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IGetFileUploadUrl, IGetFileDownloadUrl, IReadFile, IWriteFile } from './s3.interface';

const BUCKET = process.env.BUCKET;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
const REGION = process.env.REGION;
const URL_EXPIRY_TIME = parseInt(process.env.URL_EXPIRY_TIME); // time to expire in seconds

const credentials = {
    signatureVersion: 'v4',
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY
};
// AWS.config.update({
//     credentials: credentials,
//     region: REGION
// });

const s3 = new AWS.S3();

const getFileUploadPresignedUrl = async (fileParams: IGetFileUploadUrl) => {
    try {
        const s3Params = {
            Bucket: BUCKET,
            Expires: URL_EXPIRY_TIME,
            Key: fileParams.s3FilePath
        };

        const presignedUploadUrl: string = s3.getSignedUrl('putObject', s3Params);
        const s3ObjUrl = 'https://' + s3Params.Bucket + '.s3.' + REGION + '.amazonaws.com/' + s3Params.Key;
        const resp = {
            s3FilePath: fileParams.s3FilePath,
            s3UploadUrl: presignedUploadUrl,
            s3FileUrl: s3ObjUrl
        };
        // Logger.log('presignedUploadUrl: ', resp);
        return resp;
    } catch (error) {
        throw new BadRequestException(error);
    }
};
// getFileUploadPresignedUrl({ s3FilePath: 'test-file-' + Date.now() });

const getFileDownloadPresignedUrl = async (fileParams: IGetFileDownloadUrl) => {
    try {
        const s3Params = {
            Bucket: BUCKET,
            Expires: URL_EXPIRY_TIME,
            Key: fileParams.s3FilePath
        };

        const presignedDownloadUrl: string = s3.getSignedUrl('getObject', s3Params);
        const s3ObjUrl = 'https://' + s3Params.Bucket + '.s3.' + REGION + '.amazonaws.com/' + s3Params.Key;
        const resp = {
            s3FilePath: fileParams.s3FilePath,
            s3DownloadUrl: presignedDownloadUrl,
            s3FileUrl: s3ObjUrl
        };
        // Logger.log('presignedDownloadUrl', resp);
        return resp;
    } catch (error) {
        throw new BadRequestException(error);
    }
};

const getFileUrlFromS3Path = (key) => {
    const s3ObjUrl = 'https://' + BUCKET + '.s3.' + REGION + '.amazonaws.com/' + key;
    return s3ObjUrl;
};
// getFileDownloadPresignedUrl({ s3FilePath: 'test-file-1649157025056' });

const readFile = async (fileParams: IReadFile) => {
    const s3Params = {
        Bucket: BUCKET,
        Key: fileParams.s3FilePath
    };
    const resp: any = await s3
        .getObject(s3Params)
        .promise()
        .catch((e) => ({ error: e }));
    // Logger.log('readFile: ', resp);
    if (resp && resp.Body) {
        return { data: resp.Body };
    } else {
        // return { error: resp.error || resp };
        throw new BadRequestException(resp.error);
    }
};

// readFile({ s3FilePath: 'test-file-1649157025056' });

const writeFile = async (fileParams: IWriteFile) => {
    const s3Params = {
        Bucket: BUCKET,
        Key: fileParams.s3FilePath,
        Body: fileParams.data,
        ContentType: fileParams.contentType
    };
    const resp: any = await s3
        .putObject(s3Params)
        .promise()
        .catch((e) => ({ error: e }));

    Logger.log('writeFile: ', resp);
    if (resp && !resp.error) {
        return { data: resp };
    } else {
        // return { error: resp.error || resp };
        throw new BadRequestException(resp.error);
    }
};

const upload = async (fileParams: IWriteFile) => {
    const s3Params = {
        Bucket: BUCKET,
        Key: fileParams.s3FilePath,
        Body: fileParams.data,
        ContentType: fileParams.contentType
    };
    const resp: any = await s3
        .upload(s3Params)
        .promise()
        .catch((e) => ({ error: e }));

    Logger.log('writeFile: ', resp);
    if (resp && !resp.error) {
        return { data: resp };
    } else {
        // return { error: resp.error || resp };
        throw new BadRequestException(resp.error);
    }
};

export const s3Ops = {
    writeFile,
    readFile,
    upload,
    getFileUrlFromS3Path,
    getFileDownloadPresignedUrl,
    getFileUploadPresignedUrl
};

// writeFile({ s3FilePath: 'sample-json-file', data: JSON.stringify({ a: 's' }) });
