
import * as builder from 'botbuilder';
import { injectable, inject } from "inversify";
import * as contracts from "../contract/contracts";
import { serviceBase } from "./serviceBase";

/**
 * botService is the main class that creates the bot and registers the dialogs. 
 */
@injectable()
export class botService extends serviceBase implements contracts.IBotService {

    private _hostService: contracts.IHostService;
    private _bot: builder.UniversalBot;
    private _dialogs: contracts.IDialog;

    /**
     * 
     * @param  {} @inject(contracts.contractSymbols.IHostService
     * @param  {contracts.IHostService} hostService
     * @param  {} @inject("Factory<IDialog>"
     * @param  {()=>contracts.IDialog} dialogs
     */
    constructor( @inject(contracts.contractSymbols.IHostService) hostService: contracts.IHostService,
        @inject("Factory<IDialog>") dialogs: () => contracts.IDialog) {
        super();

        this._dialogs = dialogs();
        this._hostService = hostService;
    }

    /**
     * Boot the bot - creates a connector, bot and registers the dynamic dialogs. 
     */
    public boot() {

        var connector = new builder.ChatConnector({
            appId: this.config.microsoftAppId,
            appPassword: this.config.microsoftAppPassword
        });

        this._hostService.init(connector);

        this._bot = new builder.UniversalBot(connector, (session, args, next) => {
            session.endDialog(`I'm sorry, I did not understand '${session.message.text}'.\nType 'help' to know more about me :)`);
        });

        this._enableLuis();

        for (var i in this._dialogs) {
            var dialog: contracts.IDialog = this._dialogs[i];
            this._bot.dialog(dialog.id, dialog.waterfall).triggerAction({ matches: dialog.trigger });
            console.log(dialog.id);
        }

        //load dynamic configs

        var dynamicConfigs: contracts.graphDialog[] = new Array<contracts.graphDialog>();
        dynamicConfigs.push(this.getFindIngredientsDialogData());       
        dynamicConfigs.push(this.getRandomDrinkDialogData());  

        for(let i in dynamicConfigs){
            let dialogConfig = dynamicConfigs[i];
            let dynamicDialog:contracts.IDialog = this.resolve<contracts.IDialog>(contracts.contractSymbols.dataDialog);           
            dynamicDialog.init(dialogConfig);
            this._bot.dialog(dynamicDialog.id, dynamicDialog.waterfall).triggerAction({ matches: dynamicDialog.trigger });
        }        
    }

    /**
     * If LUIS is present this will enable the LUIS Recognizer and apply it to the bot. 
     */
    private _enableLuis() {
        if (this.config.luisModelUrl && this.config.luisModelUrl.length > 0) {
            var luisRecognizer = new builder.LuisRecognizer(this.config.luisModelUrl)
                .onEnabled(function (context, callback) {
                    var enabled = context.dialogStack().length === 0;
                    callback(null, enabled);
                });
            this._bot.recognizer(luisRecognizer);
            
        }
    }

   
    /**
     * Load a dialog that prepares data for the search by ingredient service
     * @returns contracts.graphDialog
     */
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

    getRandomDrinkDialogData():contracts.graphDialog{        
       

        var d:contracts.dialogData = {
            
        }

        var graphDialog:contracts.graphDialog = {
            isLuis: true,
            triggerText: 'Show me a random cocktail',
            id: 'randomCocktail',
            data: d,
            initialSay: `Okay let's get some random up in here`,
            action:{
                serviceUrlAfter:"https://cocktailservicesforndc.azurewebsites.net/api/FindRandom?code=wUJRdzfE56kRrXCkdhM3a6LFklQR1DDFyV/lYGc0dC6PfRsRFHCzIg=="
            }
        }

        return graphDialog;
    }

    // getStartOrderDialogData():contracts.graphDialog{        
    //     var fields: contracts.dialogField[] = [{
    //         entityName: 'deliveryMode',
    //         promptText: 'Would you like take away or home delivery?',
    //         choice:["Home Delivery", "Pickup"]
    //     }];

    //     var d:contracts.dialogData = {
    //         fields:fields
    //     }

    //     var graphDialog:contracts.graphDialog = {
    //         isLuis: true,
    //         triggerText: 'StartOrder',
    //         id: 'startOrderDialog',
    //         data: d,
    //         initialSay: `Okay, let's get us some pizza!`           
    //     }

    //     return graphDialog;
    // }
}