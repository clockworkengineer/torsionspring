/* 
 * The MIT License
 *
 * Copyright 2016 Robert Tizzard.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Currently SQLite/MySQL are the only databases supported.

var db1 = require("./di_sqlite");
var db2 = require("./di_mysql");

// Customization processing. Indexed by file name.

var customisations = [];
customisations["Accupedo daily logs"] = {translator: accupedo, options: {header: ["year", "month", "day", "steps", "miles", "calories", "duration"]}, handler: db1.SQL, params : { databaseName: "accupedo", tableName : "walks"}};

// The CSV created by accupedo has three numeric fields for the date so just convert
// those to somthing sensible and copy the rest. Also the file doesn"t contain a
// header but chokidar will have added those for us with specifying header options above.

function accupedo(record) {
    var newRecord = {};
    var dateOfExecersize = new Date(record.year, record.month-1, record.day);
    newRecord["date"] = dateOfExecersize.toDateString();
    newRecord["steps"] = record.steps;
    newRecord["miles"] = record.miles;
    newRecord["calories"] = record.calories;
    newRecord["duration"] = record.duration;
    return(newRecord);
}

// Don't modify JSON

function leaveit(record) {
   return(record);
}

// No customsation then use default otherwise return selected customsation.

module.exports= function (filename, params) {
    console.log(filename);
    if (!customisations[filename]) {
        return({translator: leaveit, options: {header: true}, handler: db1.SQL, params : params});
    }
    return(customisations[filename]);
};