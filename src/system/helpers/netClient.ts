import * as restify from 'restify';

import * as request from 'request';

import * as contracts from "../contract/contracts";
import { injectable } from "inversify";

@injectable()
export class netClient implements contracts.INetClient {

    public async postJson<TUpload, TResult>(url: string, path: string, postData: TUpload, headers?: any): Promise<TResult> {
        return new Promise<TResult>((good, bad) => {

            var uri = url + path;

            var opts: request.CoreOptions =
                {

                }

            if (headers) {
                opts.headers = headers;
            }

            var req = request.post(uri, opts, (error: any, response: request.RequestResponse, body: any) => {
                if (error) {
                    bad(error);
                    return;
                }

                var result = response.body;

                try {
                    var resultObj = JSON.parse(result);

                    good(resultObj);
                } catch (e) {
                    bad(e);
                }

            });

            // var clientOptions:restify.ClientOptions = {
            //     url: url
            // }

            // if(headers){
            //     clientOptions.headers = headers;
            // }

            // var jsonClient = restify.createJsonClient(clientOptions); 

            // jsonClient.post(path, postData,(err, req, res, obj: TResult)=>{
            //     if(err){
            //         bad(err);
            //         return;
            //     }
            //     good(obj);
            // })
        });
    }
}