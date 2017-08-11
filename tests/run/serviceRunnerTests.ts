import { cocktailService } from './../../src/model/components/cocktailService';
import * as modelContracts from './../../src/model/modelContracts';
import { testBase } from './../testBase';
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import * as contracts from "../../src/system/contract/contracts";

class serviceRunnerTests extends testBase{
    async test_get_a_genericService(t:TestContext){
        
        var genericServiceRunner = this.resolve<contracts.IServiceRunner>
            (contracts.contractSymbols.IServiceRunner);
        
        t.truthy(genericServiceRunner);

        var options:contracts.IServiceRunnerOptions = {
            url: "https://cocktailservicesforndc.azurewebsites.net/api/FindRandom?code=wUJRdzfE56kRrXCkdhM3a6LFklQR1DDFyV/lYGc0dC6PfRsRFHCzIg=="
        }

        var result = await genericServiceRunner.run({}, options);

        t.true(result.success);
    }
}

var testClass = new serviceRunnerTests();

test(testClass.test_get_a_genericService.bind(testClass));