import { cocktailService } from './../../src/model/components/cocktailService';
import * as modelContracts from './../../src/model/modelContracts';
import { testBase } from './../testBase';
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import * as contracts from "../../src/system/contract/contracts";

class cocktailLiveTests extends testBase{
    async test_gets_a_cocktail(t:TestContext){
        
        var cocktailService = this.resolve<modelContracts.ICocktailService>
            (modelContracts.modelSymbols.ICocktailService);
        
        t.truthy(cocktailService);

        let max:number = 2;

        var result = await cocktailService.getCocktails("manhattan", max);

        t.true(result.length > 0);
        
        t.is(result.length, max)

        t.true(result[0].ingredients.length > 0);        
    }
}

var testClass = new cocktailLiveTests();

test(testClass.test_gets_a_cocktail.bind(testClass));