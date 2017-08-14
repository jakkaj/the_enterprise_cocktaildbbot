
import { cocktailService } from './../../src/model/components/cocktailService';
import * as modelContracts from './../../src/model/modelContracts';
import { testBase } from './../testBase';
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import * as contracts from "../../src/system/contract/contracts";

class cocktailSearchTests extends testBase {

    private _searchDialog: contracts.IDialog;

    /**
     *
     */
    constructor() {
        super();
        
    }

    async test_gets_a_cocktail_no_entity(t: TestContext) {        
        t.is(true, true);
    }

    test_gets_a_cocktail_has_entity(t: TestContext) {   
        t.is(true, true);

    }

    //show me how to make a
}

var testClass = new cocktailSearchTests();

test(testClass.test_gets_a_cocktail_no_entity.bind(testClass));
test(testClass.test_gets_a_cocktail_has_entity.bind(testClass));