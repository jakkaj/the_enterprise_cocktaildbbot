import { cocktailService } from './../../src/model/components/cocktailService';
import * as modelContracts from './../../src/model/modelContracts';
import { testBase } from './../testBase';
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import * as contracts from "../../src/system/contract/contracts";

class cocktailLiveTests extends testBase{
    async test_gets_a_cocktail(t:TestContext){
        
       
    }
}

var testClass = new cocktailLiveTests();

test(testClass.test_gets_a_cocktail.bind(testClass));