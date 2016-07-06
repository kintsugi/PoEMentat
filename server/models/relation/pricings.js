var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.Pricings.belongsTo(Schemas.Imports, {
    as: 'Import',
    foreignKey: 'import_id',
  });
  Schemas.Pricings.belongsTo(Schemas.CurrencyTypes, {
    as: 'MainCurrency',
    foreignKey: 'main_currency_id',
  });
  Schemas.Pricings.belongsTo(Schemas.CurrencyTypes, {
    as: 'AlternateCurrency',
    foreignKey: 'alternate_currency_id',
  });
  Schemas.Pricings.belongsTo(Schemas.TradeGroups, {
    as: 'TradeGroup',
    foreignKey: 'trade_group_id',
  });

  Schemas.Pricings.belongsToMany(Schemas.Offers, {
    as: 'SellOffers',
    through: Schemas.OffersPricings,
    foreignKey: 'pricing_id',
    otherKey: 'sell_offer_id',
  });
  Schemas.Pricings.belongsToMany(Schemas.Offers, {
    as: 'BuyOffers',
    through: Schemas.OffersPricings,
    foreignKey: 'pricing_id',
    otherKey: 'buy_offer_id',
  });
  Schemas.Pricings.belongsToMany(Schemas.Offers, {
    as: 'MinSellOffers',
    through: Schemas.OffersPricings,
    foreignKey: 'pricing_id',
    otherKey: 'min_sell_offer_id',
  });
  Schemas.Pricings.belongsToMany(Schemas.Offers, {
    as: 'MaxSellOffers',
    through: Schemas.OffersPricings,
    foreignKey: 'pricing_id',
    otherKey: 'max_sell_offer_id',
  });
  Schemas.Pricings.belongsToMany(Schemas.Offers, {
    as: 'MinBuyOffers',
    through: Schemas.OffersPricings,
    foreignKey: 'pricing_id',
    otherKey: 'min_buy_offer_id',
  });
  Schemas.Pricings.belongsToMany(Schemas.Offers, {
    as: 'MaxBuyOffers',
    through: Schemas.OffersPricings,
    foreignKey: 'pricing_id',
    otherKey: 'max_buy_offer_id',
  });
}
