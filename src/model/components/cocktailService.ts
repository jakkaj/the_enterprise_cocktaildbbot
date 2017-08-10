import { ICocktail } from './../modelContracts';

import "reflect-metadata";

import { injectable, inject } from 'inversify';
import * as _ from 'underscore';

import { netClient } from './../../system/helpers/netClient';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';
import * as modelContracts from "../modelContracts";



/**
 * 
 */
@injectable()
export class cocktailService extends serviceBase implements modelContracts.ICocktailService {

    private _netClient: contracts.INetClient;

    /**
     *
     */
    constructor( @inject(contracts.contractSymbols.INetClient) netClient: contracts.INetClient) {
        super();

        this._netClient = netClient;
    }

    public async getRandomCocktail(): Promise<modelContracts.ICocktail[]> {
        //http://www.thecocktaildb.com/api/json/v1/1/random.php

        let url = `http://www.thecocktaildb.com/`;
        let path = `/api/json/v1/1/random.php`;

        return await this._runQuery(url, path);
    }

    public async getByIngredient(ingredientName: string, max:number = 5): Promise<modelContracts.ICocktail[]> {
        //http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin
        let url = `http://www.thecocktaildb.com/`;
        let path = `/api/json/v1/1/filter.php?i=${ingredientName}`;

        return await this._runQuery(url, path, max);
    }

    public async getCocktails(cocktailName: string, max: number = 5): Promise<modelContracts.ICocktail[]> {
        let url = `http://www.thecocktaildb.com/`;
        let path = `/api/json/v1/1/search.php?s=${cocktailName}`;

        return await this._runQuery(url, path, max);
    }

    public async getById(id: string): Promise<modelContracts.ICocktail[]> {
        let url = `http://www.thecocktaildb.com/`;
        let path = `/api/json/v1/1/lookup.php?i=${id}`;    
        return await this._runQuery(url, path);    
    }

    //http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15112

    private async _runQuery(url: string, path: string, max: number = 5): Promise<modelContracts.ICocktail[]> {
        var result = await this._netClient.postJson<any, modelContracts.rawCocktail>(
            url,
            path, {});

        if (!result || !result.drinks) {
            return null;
        }

        result.drinks = _.sortBy(result.drinks, (item) => {
            return item.strDrinkThumb == null;
        });

        if (result.drinks.length > max) {
            result.drinks = result.drinks.slice(0, max);
        }

        var cocktails: ICocktail[] = [];

        result.drinks.forEach((value: modelContracts.Drink) => {

            var asAny: any = value; 
            
            var cocktail: ICocktail = {
                title: value.strDrink,
                instructions: value.strInstructions,
                ingredients: [],
                image: value.strDrinkThumb,
                id: value.idDrink
            }

            console.log(cocktail.image);

            for (let i = 1; i <= 15; i++) {
                
                var ingredient = asAny[`strIngredient${i}`] + ' ' + asAny[`strMeasure${i}`];
                ingredient = ingredient.replace('\r\n', '');
                
                if(ingredient.length > 1){
                    cocktail.ingredients.push(ingredient);
                }               
            }

            cocktails.push(cocktail);
        });

        return cocktails;
    }
}
