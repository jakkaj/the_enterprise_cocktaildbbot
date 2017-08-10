import * as builder from 'botbuilder';
import * as contracts from '../../system/contract/contracts';
export default class cardConverter {

    public basicCardToHeroCard(cards: contracts.heroCard[], session: builder.Session): builder.HeroCard[] {
        var heroCards: builder.HeroCard[] = [];

        cards.forEach(card => {

            var images: builder.IIsCardImage[] = [];

            card.images.forEach((image) => {
                var cardImage: builder.IIsCardImage = builder.CardImage.create(session, image);
                images.push(cardImage);
            });

            var buttons: builder.IIsCardAction[] = [];

            card.buttons.forEach((button)=>{
                var cardButton = builder.CardAction.imBack(session, button[0], button[1]);
                buttons.push(cardButton);
            });

            var heroCard = new builder.HeroCard(session)
                .title(card.title)
                .subtitle(card.subtitle)
                .text(card.text)
                .images(images)
                .buttons(buttons);            

            heroCards.push(heroCard);           
        });

        return heroCards;
    }
}