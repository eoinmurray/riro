#! /usr/bin/env node

var path = require('path')
var fs = require('fs')
var cwd = process.cwd()

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

var bashProfile = path.join(getUserHome(), '.bash_profile')

fs.exists(bashProfile, function(exists){
  if (!exists) return console.log(`Sorry ${bashProfile} does not exist.`)

  fs.readFile(bashProfile, function(err, data){
    if (err) throw err;
    fs.writeFile(bashProfile + '.riro', data, function(err){
      if (err) throw err;

      var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(bashProfile)
      });

      var lines = ''
      var found = false
      var newAlias = `alias p='cd ${cwd}'\n`
      lineReader.on('line', function (line) {
        if (line.startsWith('alias p=')){
          lines += newAlias
          found = true
        } else {
          lines += line + '\n'
        }
      })

      lineReader.on('close', function(){
        if (!found) lines += newAlias

        fs.writeFile(bashProfile, lines, function(err){
          if (err) throw err;
          console.log(`set alias "p" to ${cwd} in ${bashProfile}`)
        })
      })
    })
  })
})
