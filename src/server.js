import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './app';
import template from './template';

const server = express();

server.use('/assets', express.static('assets'));
var searchKey = 'desk'

server.get('/', (req, res) => {


    var request = require("request"),
        cheerio = require("cheerio"),
        url = "http://www.trademe.co.nz/Browse/SearchResults.aspx?searchString=" + searchKey + "&type=Search&searchType=all&user_region=12&generalSearch_keypresses=5&generalSearch_suggested=0&generalSearch_suggestedCategory=&user_district=65&buy=buynow",
        priceItemCount = 0,
        totalItemCount = 0,
        priceItems = [];


    request(url, function (error, response, body) {
        if (error) {
            console.log('Couldn’t get page because of error: ' + error);
            return;
        }

        // load the body of the page into Cheerio so we can traverse the DOM
        var $ = cheerio.load(body),
            items = $(".supergrid-bucket");

        items.each(function (i, item) {
            // get the href attribute of each link
            var itemLine = $(item).children("a");
            itemLine.each(function (j, itemCell) {
                var url = $(this).attr('href');
                var title = $(this).find('.info > .title').html();
                var price = $(this).find('.listingBuyNowPrice').html();
                url = 'http://www.trademe.co.nz' + url;

                if (price) {
                    totalItemCount++;
                    price = price.replace("$", "");
                    console.log('price', price)
                    if (price < 100) {
                        priceItemCount++;
                        priceItems.push({
                            title: title,
                            price: price,
                            link: url
                        })
                    }

                }
            })


        });

        // const isMobile = true;
        const itemList = priceItems
        const initialState = {searchKey, itemList};
        //We’re start by creating an `initialState` object and spreading
        // that to our root component and pass it down to our template.
        const appString = renderToString(<App {...initialState} />);

        res.send(template({
            body: appString,
            title: 'Hello World from the server',
            initialState: JSON.stringify(initialState)
        }));

        console.log('priceItems', priceItems, " \n priceItemCount ", priceItemCount, " \n totalItemCount", totalItemCount);
    });


});

server.listen(8080);
console.log('listening 8080');
