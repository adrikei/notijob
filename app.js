'use strict'
var notifier = require('node-notifier')
var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')
var marked = require('marked')

/*input*/
var input = require('./input.json')
var lastNotified = require('./file.json')

/*var*/
function markdownOpenings(openings){
  var markedDown = ''
  var lastDomain = ''
  openings.forEach((opening, index, arr)=>{
    if(opening.domain !== lastDomain){
      markedDown += marked('# ' + opening.company)
      lastDomain = opening.domain
    }
    markedDown += marked('#### ['+opening.description+'](' + opening.link + ')')
  })
  return markedDown
}

function notify(fileName){
  notifier.notify({
    title: 'New Openings are available',
    message: 'Click to check them out!',
    open: 'file://' + __dirname + '/' + fileName
    //'wait': true
  })
}

function listOpenings(company, source){
  var $ = cheerio.load(source)
  var data = []
  var pai = company.selectors[0]
  var filho = company.selectors[1]

  $(pai).each((i, vlr)=>{
    var description
    if(filho){
      description = $(vlr).find(filho).text()
    }else{
      description = $(vlr).text()
    }
    description = description.replace( /[\s\s+|\n]/g, ' ' )
    // console.log(description)
    var link = $(vlr).attr('href')
    if(description){
      data.push({})
      data[data.length-1].company = company.company
      data[data.length-1].domain = company.domain;
      data[data.length-1].description = description
      if(link.indexOf('http://') === -1){
        link = company.domain + link;
      }
      data[data.length-1].link = link
    }
  })
  return data
}

function checkForOpenings(input, previousVersion){
  var markedHtml = ''
  var sitesCount = input.length
  input.forEach((company, index, arr)=>{
    var pageSource = ''
    //console.log('Checking url:', company.domain + company.path)
    http.get(company.domain + company.path, (res)=>{
      res.setEncoding('utf8');
      res.on('data', (chunk)=>{
        pageSource += chunk
      })
      res.on('end', ()=>{
        var openings = listOpenings(company, pageSource)
        markedHtml += markdownOpenings(openings)
        sitesCount--
        if(sitesCount === 0){
          if(markedHtml !== previousVersion){
            fs.writeFile('./openings.html', markedHtml)
            notify('openings.html')
          }else{
            console.log('No new openings found')
          }
        }
      })
    }).on('error', (e)=>{})
  })
}
fs.readFile('./openings.html', 'utf8', (err, data) => {
  if(!err){
    var previousVersion = data
    checkForOpenings(input, previousVersion)
  }
})
