
import * as builder from 'botbuilder';
import { injectable, inject } from 'inversify';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';
import * as modelContracts from './../../model/modelContracts';
/**
* A bot dialog
*/
@injectable()
export default class mainCocktailSearchDialog extends serviceBase implements contracts.IDialog {

    public id: string = 'mainCocktailSearchDialog';
    public name: string = 'mainCocktailSearchDialog';
    public trigger: string = 'How to make a cocktail';

    private _cocktailService: modelContracts.ICocktailService;

    /**
    * 
    */
    constructor(
        @inject(modelContracts.modelSymbols.ICocktailService)
        cocktailService: modelContracts.ICocktailService) {

        super();

        this._cocktailService = cocktailService;
    }

    public get waterfall(): builder.IDialogWaterfallStep[] {
        return [this.step1.bind(this), this.step2.bind(this)];
    }

    /**
    * Step 1
    * @param  {builder.Session} session
    * @param  {any} args
    * @param  {Function} next
    */
    private step1(session: builder.Session, args: any, next: Function) {
        console.log(args);

        if (args === undefined) {
            session.endConversation('something went wrong- couldn\'t get intent');
            return;
        }

        // var jsoned = JSON.stringify(args);

        // console.log(jsoned);

        let entity = builder.EntityRecognizer.findEntity(args.intent.entities, 'cocktail name');

        if (entity) {
            next({ response: entity.entity });
        }
        else {
            builder.Prompts.text(session, 'Okay sure, what kind of cocktail are you looking for?');
        }
    }

    /**
    * Step 2
    * @param  {builder.Session} session
    * @param  {builder.IDialogResult<string>} results
    * @param  {Function} next
    */
    private async step2(session: builder.Session, results: builder.IDialogResult<string>, next: Function) {

        var result = results.response;

        session.send(`Okay, searching for ${results.response}`);
        session.sendTyping();

        var cocktailResult = await this._cocktailService.getCocktails(result, 5);        

        if (!cocktailResult || cocktailResult.length == 0) {
            session.endDialog(`Sorry, I couldn't find any cocktails named ${result}`);
            return;
        }

        session.send(`Found ${cocktailResult.length} results`);

        var cards: builder.HeroCard[] = [];

        cocktailResult.forEach(cocktail => {

            var card = new builder.HeroCard(session)
                .title(cocktail.title)
                .subtitle('')
                .text(cocktail.instructions + '\n\r\n ' + cocktail.ingredients.join(' \r\n '))
                .images([
                    builder.CardImage.create(session, cocktail.image)
                ])

            cards.push(card);
        });

        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);
        
        session.send(reply)

        session.endDialog();        
    }
}
