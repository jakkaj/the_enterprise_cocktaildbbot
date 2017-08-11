
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
        this._searchDialog = this.resolveDialog<contracts.IDialog>('mainCocktailSearchDialog');
    }

    async test_gets_a_cocktail_no_entity(t: TestContext) {
        t.not(undefined, this._searchDialog);
        t.is(this._searchDialog.name, 'mainCocktailSearchDialog');

        var func = this._searchDialog.waterfall[0];

        var args = { "action": "*:cocktailSearch", "intent": { "score": 0.8375309, "intent": "How to make a cocktail", "intents": [{ "intent": "How to make a cocktail", "score": 0.8375309 }, { "intent": "Show me a random cocktail", "score": 0.147423267 }, { "intent": "None", "score": 0.0224154647 }, { "intent": "What cocktails have this ingredient", "score": 0.0143526094 }], "entities": [], "compositeEntities": [] }, "libraryName": "*" }

        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = sinon.createStubInstance(builder.Session);
        func(session, args, next);
        textSpy.restore();
        t.is(0, next.callCount)
        t.true(textSpy.calledWith(session, 'Okay sure, what kind of cocktail are you looking for?'));

    }

    test_gets_a_cocktail_has_entity(t: TestContext) {

        t.not(undefined, this._searchDialog);
        t.is(this._searchDialog.name, 'mainCocktailSearchDialog');

        var func = this._searchDialog.waterfall[0];

        var args = {"action":"*:mainCocktailSearchDialog","intent":{"score":0.981485367,"intent":"How to make a cocktail","intents":[{"intent":"How to make a cocktail","score":0.981485367},{"intent":"Show me a random cocktail","score":0.033827208},{"intent":"What cocktails have this ingredient","score":0.006536661},{"intent":"None","score":0.004407801}],"entities":[{"entity":"manhattan","type":"cocktail name","startIndex":22,"endIndex":30,"score":0.9816807}],"compositeEntities":[]},"libraryName":"*"}
        
        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = sinon.createStubInstance(builder.Session);

        func(session, args, next);
        textSpy.restore();

        t.true(next.calledOnce);
        t.is(textSpy.callCount, 0);


    }

    //show me how to make a
}

var testClass = new cocktailSearchTests();

test(testClass.test_gets_a_cocktail_no_entity.bind(testClass));
test(testClass.test_gets_a_cocktail_has_entity.bind(testClass));