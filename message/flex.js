const util = require("../util");

const build = (flex_raw, sender, opt_texts = []) => {
  const color = util.getFlexColor();
  flex_raw = Array.isArray(flex_raw) ? flex_raw : [flex_raw];

  let flex_msg = {
    type: "flex",
    altText: `${flex_raw[0].headerText}`,
    contents: {
      type: "carousel",
      contents: []
    },
    sender
  };

  let bubble = {};

  const headerTextColor = isLightColor(color.main) ? "#121212" : "#ffffff";

  flex_raw.forEach((item, index) => {
    bubble[index] = {
      type: "bubble",
      size: "giga",
      header: {
        type: "box",
        layout: "vertical",
        borderWidth: "none",
        cornerRadius: "none",
        contents: [
          {
            type: "text",
            text: item.headerText,
            color: headerTextColor,
            weight: "bold",
            align: "center",
            wrap: true,
            size: "lg"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        borderWidth: "none",
        contents: []
      },
      styles: {
        header: {
          backgroundColor: color.main
        },
        body: {
          backgroundColor: color.background
        },
        footer: {
          backgroundColor: color.background,
          separator: false
        }
      }
    };

    if (item.bodyText) {
      let bodyText = {
        type: "text",
        text: item.bodyText.trim(),
        weight: "regular",
        wrap: true,
        size: "md",
        color: color.text
      };

      if (item.table) {
        bodyText.offsetBottom = "8px";
      }

      bubble[index].body.contents.push(bodyText);
    }

    if (item.table) {
      let headers = item.table.headers;
      let contents = item.table.contents;

      let table_header = { type: "box", layout: "horizontal", contents: [] };

      let header_content = {};
      headers.forEach((item, index) => {
        header_content[index] = {
          type: "text",
          text: item.toString(),
          weight: "bold",
          flex: 1,
          wrap: true,
          align: "start",
          color: color.text
        };

        // default header "Name"
        if (index === 1) {
          header_content[index].flex = 3;
        } else if (index > 1) {
          header_content[index].flex = 2;
          header_content[index].align = "center";
        }

        table_header.contents.push(header_content[index]);
      });

      let separator = {
        type: "separator",
        color: color.main,
        margin: "sm"
      };

      bubble[index].body.contents.push(table_header, separator);

      let table_body = {};

      let table_content = {};
      contents.forEach((item, content_idx) => {
        table_body[content_idx] = {
          type: "box",
          layout: "horizontal",
          contents: [],
          margin: "sm"
        };

        item.forEach((c, idx) => {
          table_content[idx] = {
            type: "text",
            text: c.toString(),
            flex: 1,
            wrap: true,
            align: "start",
            color: color.text,
            size: "sm"
          };

          if (table_content[idx].text.length > 14) {
            table_content[idx].wrap = false;
          }

          // default header "Name"
          if (idx === 1) {
            table_content[idx].flex = 3;
          } else if (idx > 1) {
            table_content[idx].flex = 2;
            table_content[idx].align = "center";
          }

          table_body[content_idx].contents.push(table_content[idx]);
        });

        bubble[index].body.contents.push(table_body[content_idx]);
      });
    }

    if (item.buttons) {
      const buttonStyle = isLightColor(color.main) ? "secondary" : "primary";

      bubble[index].footer = {
        type: "box",
        layout: "vertical",
        contents: [],
        spacing: "md"
      };

      let opt_button = {};
      let data_button = {};
      let temp = 1;

      for (let i = 0; i < item.buttons.length; i++) {
        opt_button[i] = {
          type: "box",
          layout: "horizontal",
          contents: [],
          spacing: "md"
        };

        data_button[i] = {
          type: "button",
          action: {},
          style: buttonStyle,
          color: color.main,
          adjustMode: "shrink-to-fit"
        };

        if (item.buttons[i].action === "postback") {
          data_button[i].action = {
            type: item.buttons[i].action,
            label: item.buttons[i].label,
            data: item.buttons[i].data
          };
        } else if (item.buttons[i].action === "uri") {
          data_button[i].action = {
            type: item.buttons[i].action,
            label: item.buttons[i].label,
            uri: item.buttons[i].data
          };
        }

        opt_button[i].contents.push(data_button[i]);

        if ((parseInt(i) + 1) % 2 === 0) {
          bubble[index].footer.contents[parseInt(i) - temp].contents.push(data_button[i]);
          temp++;
        } else {
          bubble[index].footer.contents.push(opt_button[i]);
        }
      }
    }

    flex_msg.contents.contents.push(bubble[index]);
  });

  if (opt_texts.length > 0) {
    flex_msg = [flex_msg];
    opt_texts.forEach(item => {
      flex_msg.push(item);
    });
  }

  return flex_msg;
};

const isLightColor = color => {
  // Thanks to
  // https://awik.io/determine-color-bright-dark-using-javascript/

  // Variables for red, green, blue values
  let r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  build
};
