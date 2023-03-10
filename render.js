const fs = require('fs');
const cheerio = require('cheerio');

const htmlFile = fs.readFileSync('./public/index.html', 'utf8');
const $ = cheerio.load(htmlFile);

const $head = $('head');

$('link').each((i, elem) => {
  const $elem = $(elem);

  if ($elem.attr('rel') !== 'stylesheet') {
    return;
  }

  const href = $elem.attr('href');
  const splited = href.split('/');
  const fileName = splited[splited.length - 1];

  const text = fs.readFileSync(`./public/css/${fileName}`, 'utf8');

  $elem.remove();
  $head.append(`<style>${text}</style>`)
});

$('img').each((i, elem) => {
  const $elem = $(elem);

  const src = $elem.attr('src');
  const splited = src.split('/');
  const fileName = splited[splited.length - 1];

  const image = fs.readFileSync(`./public/images/${fileName}`);
  const base64Image = Buffer.from(image).toString('base64');
  $elem.attr('src', `data:image/png;base64, ${base64Image}`);
});

fs.writeFileSync('./CV.html', $.html());
