var Schemas = require('../schemas.js');

module.exports = function() {

  Schemas.Offers.belongsTo(Schemas.CurrencyTypes, {
    as: 'SellCurrency',
    foreignKey: 'sell_currency_id',
  });
  Schemas.Offers.belongsTo(Schemas.CurrencyTypes, {
    as: 'BuyCurrency',
    foreignKey: 'buy_currency_id',
  });
  Schemas.Offers.belongsTo(Schemas.Imports, {
    as: 'Import',
    foreignKey: 'import_id',
  });

  Schemas.Offers.belongsToMany(Schemas.Pricings, {
    as: 'SellPricings',
    through: Schemas.OffersPricings,
    foreignKey: 'sell_offer_id',
    otherKey: 'pricing_id',
  });
  Schemas.Offers.belongsToMany(Schemas.Pricings, {
    as: 'BuyPricings',
    through: Schemas.OffersPricings,
    foreignKey: 'buy_offer_id',
    otherKey: 'pricing_id',
  });
  Schemas.Offers.belongsToMany(Schemas.Pricings, {
    as: 'MinSellPricings',
    through: Schemas.OffersPricings,
    foreignKey: 'min_sell_offer_id',
    otherKey: 'pricing_id',
  });
  Schemas.Offers.belongsToMany(Schemas.Pricings, {
    as: 'MaxSellPricings',
    through: Schemas.OffersPricings,
    foreignKey: 'max_sell_offer_id',
    otherKey: 'pricing_id',
  });
  Schemas.Offers.belongsToMany(Schemas.Pricings, {
    as: 'MinBuyPricings',
    through: Schemas.OffersPricings,
    foreignKey: 'min_buy_offer_id',
    otherKey: 'pricing_id',
  });
  Schemas.Offers.belongsToMany(Schemas.Pricings, {
    as: 'MaxBuyPricings',
    through: Schemas.OffersPricings,
    foreignKey: 'max_buy_offer_id',
    otherKey: 'pricing_id',
  });
}
