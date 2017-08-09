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

    public async getCocktails(cocktailName: string, max: number = 5): Promise<modelContracts.ICocktail[]> {
        let url = `http://www.thecocktaildb.com/`;
        let path = `/api/json/v1/1/search.php?s=${cocktailName}`;

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
                image: value.strDrinkThumb
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
