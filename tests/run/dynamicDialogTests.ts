
import { cocktailService } from './../../src/model/components/cocktailService';
import * as modelContracts from './../../src/model/modelContracts';
import { testBase } from './../testBase';
import test, { TestContext } from 'ava';
import * as builder from 'botbuilder';
import * as sinon from 'sinon';

import * as contracts from "../../src/system/contract/contracts";

class cocktailSearchTests extends testBase {

    
    /**
     *
     */
    constructor() {
        super();
        
    }

    getFindIngredientsDialogData():contracts.graphDialog{        
        var fields: contracts.dialogField[] = [{
            entityName: 'ingredient',
            promptText: 'Which ingredient are you looking to make a drink with?'
        }];

        var d:contracts.dialogData = {
            fields:fields
        }

        var graphDialog:contracts.graphDialog = {
            isLuis: true,
            triggerText: 'What cocktails have this ingredient',
            id: 'cocktailByIngredient',
            data: d,
            initialSay: `Okay let's find some cocktails by their ingredients.`,
            action:{
                serviceRunnerAfter:"findByIngredientServiceRunner"
            }
        }

        return graphDialog;
    }

    getDialog():contracts.IDialog{
        let dynamicDialog:contracts.IDialog = this.resolve<contracts.IDialog>(contracts.contractSymbols.dataDialog);           
        dynamicDialog.init(this.getFindIngredientsDialogData());

        return dynamicDialog;
    }

    async test_find_ingredient_no_entity(t: TestContext) {

        var dialog = this.getDialog();

        t.not(undefined, dialog);
        t.is(dialog.id, 'cocktailByIngredient');

        var func = dialog.waterfall[1];

        var args = { "action": "*:cocktailSearch", "intent": { "score": 0.8375309, "intent": "How to make a cocktail", "intents": [{ "intent": "How to make a cocktail", "score": 0.8375309 }, { "intent": "Show me a random cocktail", "score": 0.147423267 }, { "intent": "None", "score": 0.0224154647 }, { "intent": "What cocktails have this ingredient", "score": 0.0143526094 }], "entities": [], "compositeEntities": [] }, "libraryName": "*" }

        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = this.getSession();
        
        func(session, args, next);
        textSpy.restore();
        t.is(0, next.callCount)
        t.true(textSpy.calledWith(session, 'Which ingredient are you looking to make a drink with?'));

    }

    test_find_ingredient_has_entity(t: TestContext) {

        var dialog = this.getDialog();

        t.not(undefined, dialog);
        t.is(dialog.id, 'cocktailByIngredient');

        var func = dialog.waterfall[0];

        var args = {"action":"*:cocktailByIngredient","intent":{"score":0.9834757,"intent":"What cocktails have this ingredient","intents":[{"intent":"What cocktails have this ingredient","score":0.9834757},{"intent":"None","score":0.04291801},{"intent":"Show me a random cocktail","score":0.00772835873},{"intent":"How to make a cocktail","score":0.004856124}],"entities":[{"entity":"vodka","type":"ingredient","startIndex":23,"endIndex":27,"score":0.9999668}],"compositeEntities":[]},"libraryName":"*"}
        
        var next = sinon.spy();
        var textSpy = sinon.spy(builder.Prompts, 'text');
        //var sessionStub = sinon.createStubInstance(MyConstructor) ;
        var session: builder.Session = this.getSession();

        func(session, args, next);
        textSpy.restore();

        t.true(next.calledOnce);
        t.is(textSpy.callCount, 0);


    }

    //show me how to make a
}

var testClass = new cocktailSearchTests();

test(testClass.test_find_ingredient_has_entity.bind(testClass));
test(testClass.test_find_ingredient_no_entity.bind(testClass));