import { UploadedFile } from 'express-fileupload';

export interface IFileUpload   {
  name: string;
  encoding: string;
  mimetype: string;
  data: Buffer;
  size: number;
  tempFilePath: string;
  truncated: boolean;
  md5: string;
  mv:Function;

}

 interface IFileUpload2 {
  name: string;
        encoding: string;
        mimetype: string;
        data: Buffer;
        size: number;
        tempFilePath: string;
        truncated: boolean;
        md5: string;
}

interface Data {
  type: string;
  data: number[];
}