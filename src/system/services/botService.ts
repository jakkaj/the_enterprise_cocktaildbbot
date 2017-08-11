
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
            this._bot.dialog(dialog.id, dialog.waterfall).triggerAction({ 
                matches: dialog.trigger
                // onSelectAction: (session, args, next) => {
                //     // Add the help dialog to the dialog stack 
                //     // (override the default behavior of replacing the stack)
                //     session.beginDialog(args.action, args);
                // }
            });
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
            var dAdded = this._bot.dialog(dynamicDialog.id, dynamicDialog.waterfall).triggerAction(
                { 
                     matches: dynamicDialog.trigger
                    // onSelectAction: (session, args, next) => {
                    //     // Add the help dialog to the dialog stack 
                    //     // (override the default behavior of replacing the stack)
                    //     console.log(args);
                    //     session.beginDialog(args.action, args);
                    // } 
                });      

            this._addActions(dAdded, dialogConfig, dynamicConfigs);
        }        
    }

    private _addActions(dialog: builder.Dialog, currentDialogData: contracts.graphDialog, dialogs: contracts.graphDialog[]){
        for (let i in dialogs) {

            let dialogConfig = dialogs[i];
            
            if(currentDialogData === dialogConfig){
                continue;
            }

            var trigger:string|RegExp = (dialogConfig.triggerText || dialogConfig.triggerRegex);

            dialog.beginDialogAction(`${dialogConfig.id}_action`, dialogConfig.id, {
                matches: trigger
            });
        }
    }

    /**
     * If LUIS is present this will enable the LUIS Recognizer and apply it to the bot. 
     */
    private _enableLuis() {
        if (this.config.luisModelUrl && this.config.luisModelUrl.length > 0) {
            var luisRecognizer = new builder.LuisRecognizer(this.config.luisModelUrl)
                .onEnabled(function (context, callback) {
                    //var enabled = context.dialogStack().length === 0;
                    callback(null, true);
                }).onFilter(function(context, result, callback) {
                    // Only allow it to work if the intent match is high
                    if(result.score < .3){
                        callback(null, null);
                    }else{
                        callback(null, result);
                    }
                   
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
}