var Jimp = require('jimp');
var countries = require('./countries.json');
var sizeOf = require('image-size');
// const { PerformanceObserver, performance } = require('perf_hooks');

async function main() {
  let font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

  for (const label in countries) {
    let fileName = label.toLowerCase().concat('.png');
    let outputName = label.toLowerCase().concat('-labeled.png');
    let dimensions = sizeOf('flags/' + fileName);

    console.log(`File ${fileName} length:${countries[label].length} sizes: x: ${dimensions.width} y: ${dimensions.height} \t ratio: ${dimensions.width / dimensions.height}`)

    // Measure how much extra pixels needed for writing the country name.
    let measuredHeight = Jimp.measureTextHeight(font, countries[label], 1000);
    let extraSpace = measuredHeight;
    console.log(`extraspace: ${extraSpace}`);
    let newHeight = dimensions.height + extraSpace;

    // create an empty image with the height flag + text pixels.
    let emptyImage, flag;
    let promises = []
    promises.push(Jimp.create(1000, newHeight));
    promises.push(Jimp.read('flags/' + fileName));
    // console.log(performance.now()); // This code block takes a lot of time.
    try {
      [emptyImage, flag] = await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }
    // console.log(performance.now());
    emptyImage
      .blit(flag, 0, 0) // Merge images
      .print( // Write country name
        font,
        0,
        0,
        {
          text: countries[label],
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
        },
        1000,
        newHeight
      )
      .resize(400, Jimp.AUTO) // resize
      .write('output/' + outputName); // save
  }
}

main();