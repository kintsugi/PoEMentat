var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.OffersPricings.belongsTo(Schemas.Pricings, {
    as: 'Pricing',
    foreignKey: 'pricing_id'
  });
  Schemas.OffersPricings.belongsTo(Schemas.Offers, {
    as: 'SellOffer',
    foreignKey: 'sell_offer_id'
  });
  Schemas.OffersPricings.belongsTo(Schemas.Offers, {
    as: 'BuyOffer',
    foreignKey: 'buy_offer_id'
  });
  Schemas.OffersPricings.belongsTo(Schemas.Offers, {
    as: 'MinSellOffer',
    foreignKey: 'min_sell_offer_id'
  });
  Schemas.OffersPricings.belongsTo(Schemas.Offers, {
    as: 'MaxSellOffer',
    foreignKey: 'max_sell_offer_id'
  });
  Schemas.OffersPricings.belongsTo(Schemas.Offers, {
    as: 'MinBuyOffer',
    foreignKey: 'min_sell_offer_id'
  });
  Schemas.OffersPricings.belongsTo(Schemas.Offers, {
    as: 'MaxBuyOffer',
    foreignKey: 'max_sell_offer_id'
  });
}
