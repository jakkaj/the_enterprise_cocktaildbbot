import { ICocktail } from './modelContracts';

export interface IQnAAnswer {
    answer: string;
    score: number;
}

export interface IQnaComponent{
    getAnswer(question:string):Promise<IQnAAnswer>;
}

export interface ICocktailService{
    getCocktails(cocktailName: string, max:number):Promise<ICocktail[]>;
    getRandomCocktail(): Promise<ICocktail[]>;
    getByIngredient(ingredientName: string, max:number): Promise<ICocktail[]>;
    getById(id: string): Promise<ICocktail[]>;
}


export interface ICocktail {
    title: string,
    instructions: string,
    ingredients: string[],
    image: string,
    id:string
}

/**
 * Raw results from the cockail db
 */


    export interface Drink {
        idDrink: string;
        strDrink: string;
        strCategory: string;
        strAlcoholic: string;
        strGlass: string;
        strInstructions: string;
        strDrinkThumb: string;
        strIngredient1: string;
        strIngredient2: string;
        strIngredient3: string;
        strIngredient4: string;
        strIngredient5: string;
        strIngredient6: string;
        strIngredient7: string;
        strIngredient8: string;
        strIngredient9: string;
        strIngredient10: string;
        strIngredient11: string;
        strIngredient12: string;
        strIngredient13: string;
        strIngredient14: string;
        strIngredient15: string;
        strMeasure1: string;
        strMeasure2: string;
        strMeasure3: string;
        strMeasure4: string;
        strMeasure5: string;
        strMeasure6: string;
        strMeasure7: string;
        strMeasure8: string;
        strMeasure9: string;
        strMeasure10: string;
        strMeasure11: string;
        strMeasure12: string;
        strMeasure13: string;
        strMeasure14: string;
        strMeasure15: string;
        dateModified: string;
    }

    export interface rawCocktail {
        drinks: Drink[];
    }






let modelSymbols = {
    IQnaComponent: Symbol("IQnaComponent"), 
    ICocktailService: Symbol("ICocktailService")
}

export {modelSymbols}