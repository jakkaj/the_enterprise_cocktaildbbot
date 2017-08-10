import * as modelContracts from "../../model/modelContracts";
import * as contracts from "../../system/contract/contracts";

export default class cocktailConverter {

    public cocktailToCard(cocktails: modelContracts.ICocktail[]):contracts.heroCard[] {
        var cards: contracts.heroCard[] = [];

        cocktails.forEach(cocktail => {

            var card: contracts.heroCard = {
                title: cocktail.title,
                subtitle: '',
                text: cocktail.instructions + '\n\r\n ' + cocktail.ingredients.join(' \r\n '),
                images: [cocktail.image], 
                buttons: [[`Show me details on ${cocktail.id}`, "Show More"]]
            };

            if (card.text.indexOf('undefined') != -1) {
                card.text = '';
            }

            cards.push(card);
        });

        return cards;
    }
}