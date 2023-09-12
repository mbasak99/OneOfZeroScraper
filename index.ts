import { Link } from "./types";
import { Pushover } from "pushover-js";

console.log("Running webscraper...");

// setup variables
var Xray: any = require("x-ray");

var xray = Xray();
const pushover = new Pushover(
  Bun.env.USER_TOKEN ?? "",
  Bun.env.APP_TOKEN ?? ""
);
const MILLISECONDS = 1000;

var scrape = () => {
  // go to site and find the nodes
  xray("https://oneofzero.net/collections/pulsar", ".grid-item__content", [
    {
      title: ".grid-product__title",
      link: ".grid-item__link@href",
      price: ".grid-product__price--current .visually-hidden",
      image: ".grid__image-ratio img@data-srcset",
    },
  ])((err: any, result: Link[]) => {
    if (err) {
      console.error(err);
    } else {
      let filteredItems: Link[] = result.filter((result: Link) =>
        result.title.includes("X2H")
      );

      filteredItems.forEach((item: Link) => {
        if (item.title.includes("Mini")) {
          xray(item.link, "button.add-to-cart", [
            { availability: "@disabled" },
          ])((err: any, result: any) => {
            if (!result[0]?.availability) {
              pushover
                .setUrl(item.link, item.title)
                //   .setAttachment
                .send(
                  item.title,
                  `The ${item.title} is available on OneOfZero for ${item.price}!`
                );
            }
          });
        }
      });
      console.log(filteredItems);
    }
  });
};

// have the site scraped every minute
setInterval(scrape, MILLISECONDS * 60);
