# ExileMentat Server

## URL scheme
The server for ExileMentat will parse the site at a high frequency to approach realtime market spectation. The currency.poe.trade is segmented into a set of pages with the following url scheme:

`http://currency.poe.trade/search?league=<LEAGUE>&online=<ONLINE>&want=<ITEM_ID>&have=<ITEM_ID>`

The possible values of `LEAGUE` and `ITEM_ID` can be determined from parsing the information from currency.poe.trade. `ONLINE` is an empty string for online and offline orders and an `x` for only online orders.

It is possible to get all orders with one url by leaving the `ITEM_ID` field blank for both want and have.

## Pricing
Because Path of Exile has no set currency, it is hard to define what a buy or sell order is. There is no elegant way to determine a universal ratio for an item (i.e. buying alterations for 14:1 chaos, selling at 17:1 chaos) as you can pay or using many different item types. Therefore, to properly determine a margin each item will have to be treated as a currency. For example:

Two Orders, one where want=chaos, have=alt and want=alt, have=chaos:
`1: Chaos:1 Alteration:20`
`2: Alteration:17 Chaos:1`

We essentially want to simplify each order as currency per product. Then we can determine a margin easily with `sell - buy`. currency.poe.trade separates orders with the left side order as sell and the right side order as buy. If we treat Chaos as the currency, then 1 is the buy order for alts with value of `1c/20alts = 0.05c/alts` and 2 is the sell order with value of `1c/17alts ~= 0.059c/alts` with a margin of `0.059c/alts - 0.05c/alts = 0.009c/alts`. We can interpret this as we profit 0.01 chaos per alteration traded.

However, if we set our currency to alterations, then it looks a bit different:

`1: Chaos:1 Alteration:20 20alts/c`
`2: Alteration:17 Chaos:1 17alts/c`

Now 2 is the buy order and 1 is the sell order with a profit of 3alts/c. 

## Parsing

The server should run as a service that at a set interval, parse the site data and write it to a database

## Database

The database will be a mysql database run on a digitalocean instance. There will be only one table, `OFFERS` with the following Schema

```
time: DateTime,
username: string,
ign: string,
sell_id: int,
sell_value: float,
buy_id: int,
buy_value: float,
```

### Relevant DB commands

```
CREATE TABLE offers(id INT NOT NULL AUTO_INCREMENT PRIMARY_KEY, league TEXT, username TEXT, ign TEXT, sell_currency INT, sell_value DECIMAL, buy_currency INT, buy_value DECIMAL);
```
