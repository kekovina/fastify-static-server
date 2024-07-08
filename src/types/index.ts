interface IParams {
    collection: string;
    filename: string;
}

export interface IGetRequest {
    Params: IParams
}

export interface IGetFilesRequest {
  Params: Omit<IParams, 'filename'>
}

export interface IUploadRequest {
    Params: Omit<IParams, 'filename'>
}

export interface IDeleteFileRequest {
    Params: IParams
}

export interface IDropCollectionRequest {
  Params: Omit<IParams, 'filename'>
}
