import * as builder from 'botbuilder';

export interface IServiceRunner{
    run(args: any, options?:IServiceRunnerOptions):Promise<IServiceRunnerResult>;
}

export interface IServiceRunnerOptions{
    url?:string;
    path?:string;
}

export interface IServiceRunnerResult{
    success:boolean;
    text?:string;
    heroCards?:heroCard[];
}

export interface heroCard {
    title: string;
    subtitle: string;
    text: string;
    images?: string[];
    buttons?: [string,string][];
}

interface ILogService{
    log(logMessage: string);
    setLogCallback(callback:(logMessage:string) => any);
}

interface INetClient{
    postJson<TUpload, TResult>(url:string, path:string, postData:TUpload, headers?:any):Promise<TResult>;
}

interface IHostService{
    init(connector:any);
    export:any;
    log(message:string);
}

interface IBotService{
    boot();
}

//this is adapted from generator-botbuilder here: https://github.com/MicrosoftDX/generator-botbuilder/blob/master/generators/app/templates/dialogs-ts/idialog.ts

interface IDialog {
    id: string;
    name: string;
    trigger: string | RegExp;
    waterfall: builder.IDialogWaterfallStep[];
    init?:(dialog:graphDialog) => boolean;
}

interface graphDialog{
    data?:dialogData;
    isLuis:boolean;
    triggerText?:string;
    triggerRegex?:RegExp;
    id:string; 
    initialSay?:string;   
    action?:dialogAction;
}

interface dialogAction{    
    serviceUrlAfter?:string;
    serviceRunnerAfter?:string;
    nextDialog?:string;
}

interface dialogData{
    fields?:Array<dialogField>;
}

interface dialogField{
    //text that will ask if the field is missing
    promptText:string;
    entityName?:string;
    choice?:string[];
}

interface serviceResult{
    text?:string;
}

let contractSymbols = {
    ILogService: Symbol("ILogService"),    
    IConfig: Symbol("IConfig"),
    IHostService: Symbol("IHostService"),
    IBotService: Symbol("IBotService"), 
    INetClient: Symbol("INetClient"),
    dataDialog: Symbol("dataDialog"),
    IServiceRunner: Symbol("IServiceRunner")
}

export {contractSymbols, ILogService, IHostService, IBotService, IDialog, INetClient,
    graphDialog, dialogData, dialogField, serviceResult};