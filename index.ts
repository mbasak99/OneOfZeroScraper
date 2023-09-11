import { Link } from "./types";
import { Pushover } from "pushover-js";

console.log("Running webscraper...");
// console.log("Running webscraper...", Bun.env.APP_TOKEN);

// setup variables
var Xray: any = require("x-ray");

var xray = Xray().throttle(1, "60s");
const pushover = new Pushover(
  Bun.env.USER_TOKEN ?? "",
  Bun.env.APP_TOKEN ?? ""
);

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
        pushover
          .setUrl(item.link, item.title)
          //   .setAttachment
          .send(
            item.title,
            `The ${item.title} is available on OneOfZero for ${item.price}!`
          );
      }
    });
    console.log(filteredItems);
  }
});
