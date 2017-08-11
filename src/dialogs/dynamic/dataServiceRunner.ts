

import "reflect-metadata";
import * as builder from 'botbuilder';
import { injectable, inject } from 'inversify';
import * as _ from 'underscore';

import { netClient } from './../../system/helpers/netClient';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';

/**
 * 
 */
@injectable()
export class dataServiceRunner extends serviceBase implements contracts.IServiceRunner {    
    
    private _netClient:contracts.INetClient
    /**
     *
     */
    constructor(@inject(contracts.contractSymbols.INetClient) netClient:contracts.INetClient) {
        super();
        this._netClient = netClient;   
    }

    async run(args: any, options:contracts.IServiceRunnerOptions): Promise<contracts.IServiceRunnerResult> {
        
        if(!options.url){
            return {success:false};
        }        

        this.logger.log(`Generic service runner calling ${options.url}`);

        var result = await this._netClient.postJson<any, contracts.IServiceRunnerResult>(options.url, "&", args);

        return result;
    }
    
}