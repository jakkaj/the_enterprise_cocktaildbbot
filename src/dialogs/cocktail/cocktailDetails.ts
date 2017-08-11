
import * as builder from 'botbuilder';
import { injectable, inject } from 'inversify';

import { serviceBase } from './../../system/services/serviceBase';
import * as contracts from '../../system/contract/contracts';
import * as modelContracts from './../../model/modelContracts';
/**
* A bot dialog
*/
@injectable()
export default class cocktailDetailsDialog extends serviceBase implements contracts.IDialog {

    public id: string = 'cocktailDetails';
    public name: string = 'cocktailDetails';
    public trigger:RegExp = /^Show me details on (\d+)$/i

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
        return [this.step1.bind(this)];
    }

    /**
    * Step 1
    * @param  {builder.Session} session
    * @param  {any} args
    * @param  {Function} next
    */
    private async step1(session: builder.Session, args: any, next: Function) {
        
        var text = session.message.text;
        var idMatch = this.trigger.exec(text);
        var id = idMatch[1];
        session.send(`Okay, let's see about drinks with an id of ${id}`);
        session.sendTyping();

        var cocktailResult = await this._cocktailService.getById(id);        

        if (!cocktailResult || cocktailResult.length == 0) {
            session.endDialog(`Sorry, I couldn't find any cocktails with that id`);
            return;
        }   
        
        var cocktail = cocktailResult[0];

        var card = new builder.HeroCard(session)
        .title(cocktail.title)
        .subtitle('')
        .text(cocktail.instructions + '\n\r\n ' + cocktail.ingredients.join(' \r\n '))
        .images([
            builder.CardImage.create(session, cocktail.image)
        ])

        var cards: builder.HeroCard[] = [];        
        cards.push(card);

        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);
        
        session.send(reply)

        session.endDialog();        
    }   
}
