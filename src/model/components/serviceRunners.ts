import { ICocktail } from './../modelContracts';

import "reflect-metadata";
import * as builder from 'botbuilder';
import { injectable, inject } from 'inversify';
import * as _ from 'underscore';

import { netClient } from './../../system/helpers/netClient';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';
import * as modelContracts from "../modelContracts";
import cocktailConverter from "../helpers/cocktailToCard";


/**
 * 
 */
@injectable()
export class findByIngredientServiceRunner extends serviceBase implements contracts.IServiceRunner {
    
    private _cocktailService: modelContracts.ICocktailService;

    /**
     *
     */
    constructor(@inject(modelContracts.modelSymbols.ICocktailService)
                cocktailService: modelContracts.ICocktailService) {
        super();

        this._cocktailService = cocktailService;        
    }

    async run(args: any): Promise<contracts.IServiceRunnerResult> {
        
        if(!args["ingredient"]){
            return {success:false};
        }        

        var searchTerm = args["ingredient"];

        var searchResult = await this._cocktailService.getByIngredient(searchTerm, 5);

        if(!searchResult || searchResult.length == 0){
            return  {success:false, text:`Could not find any drinks that are made with ${searchTerm}`};
        }

        var c = new cocktailConverter();

        var cards = c.cocktailToCard(searchResult);

        return {success:true, heroCards:cards};
    }
    
}