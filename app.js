'use strict'
var notifier = require('node-notifier')
var http = require('http')
var fs = require('fs')
var jquery = require('jquery')
var marked = require('marked')
var jsdom = require('jsdom')

/*input*/
var input = require('./input.json')

/*var*/
function markdown(openingMap){
  var markedDown = ''
  Object.keys(openingMap).forEach((key)=>{
    var openings = openingMap[key]
    markedDown += marked(`# ${key}`)
    openings.forEach((opening) => {
      markedDown += marked(`#### [${opening.description}](${opening.link})`)
    })
  })
  return markedDown
}

function notify(fileName){
  notifier.notify({
    title: 'New Openings are available',
    message: 'Click to check them out!',
    open: 'file://' + __dirname + '/' + fileName
  })
}

function listOpenings(input, callback){
  var data = {}

  input.forEach((company, index) => {
    jsdom.env(company.domain + company.path, (err, window) => {
      var $ = jquery(window)

      var container = company.selectors.container
      var title = company.selectors.title
      var link = company.selectors.link

      $(container).each((i, vlr) => {
        var desc = $(`${container}:eq(${i}) ${title}`).text().replace(/[\s\s+|\n]/g, ' ')
        var href = $(`${container}:eq(${i}) ${link}`).attr('href')

        if(desc && href){
          data[company.company] = data[company.company] || []
          if(href.indexOf('http://') === -1){
            href = company.domain + href;
          }
          data[company.company].push({description: desc, link: href})
        }

      })
      window.close()
      if(company === input[input.length-1]){
        //console.log(data)
        callback(data)
      }
    })
  })
}

var time = parseInt(process.argv[2]);

if(time && time <= 60){
  setInterval(() => {
    listOpenings(input, (data) => {
      var markedHtml = markdown(data)
      fs.readFile('./openings.html', 'utf8', (err, previousVersion) => {
        if(!err || err.code === 'ENOENT'){
          if(markedHtml !== previousVersion){
            fs.writeFile('./openings.html', markedHtml)
            notify('openings.html')
          }else{
            console.log('No new openings found')
          }
        }else{
          console.log(err)
        }
      })
    })
  }, 1000 * 60 * time);
}else{
  console.log('usage: $ node app <time>')
}
