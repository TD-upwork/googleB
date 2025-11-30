var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var async = require('async');
//var shortid = require('shortid');
const bodyParser = require('body-parser');
const cors = require('cors');
var request = require('request');


//const { Chart, HistogramSeries} = require('@syncfusion/ej2-charts');

//const {google} = require('googleapis');
//const compute = google.compute('v1');

require('dotenv').config();

// Imports the Google Analytics Data API client library.
const {BetaAnalyticsDataClient} = require('@google-analytics/data');

propertyId = '321327520';




var app = express();

app.use(cors());

app.set('port', 4000);

var server = require('http').createServer(app);

server.listen(4000);

global.httpServer = server;

//app.use('/', express.static('views'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var number = 1;

app.get('/', function (req, res, next) {

   var initialVisit = true;

   res.render('index2', {initial: initialVisit});
})

app.get('/bp-counter', function (req, res, next) {

   res.render('bp');
})

app.get('/bp', function (req, res, next) {

   res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
   });

   var arrayViews = [];
   var url = [];
   var title = [];
   var views = [];
   var dataLength;
   var usersForChart = [];
   var thirtyMinutesAgo;
   var midnight = false;
   var midnight2 = false;

   function strToMins(t) {
      var s = t.split(":");
      return Number(s[0]) * 60 + Number(s[1]);
   }

   function minsToStr(t) {
      return Math.trunc(t / 60)+':'+('00' + t % 60).slice(-2);
   }

   async function thirtyMinutes() {

      // Get current date

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      // Get current time

      var t = new Date(); // for now
      var currentHours = t.getHours(); // => 9
      currentHours = ("0" + currentHours).slice(-2); // adds a leading 0 if single digit
      var currentMinutes = t.getMinutes(); // =>  30
      currentMinutes = ("0" + currentMinutes).slice(-2); // adds a leading 0 if single digit

      t.getSeconds(); // => 51

      var count = 1;

      var newTime = new Date(t.setMinutes(t.getMinutes() - 30));
      var newHours = newTime.getHours();
      newHours = ("0" + newHours).slice(-2);
      var newMinutes = newTime.getMinutes();
      newMinutes = ("0" + newMinutes).slice(-2);


      var options = {
         'method': 'GET',
         'url': 'https://www.bastillepost.com/admin/statistics/es/impressions?after=' + today + 'T' + newHours + '%3A' + newMinutes + '%3A00&before=' + today + 'T' + currentHours + '%3A' + currentMinutes + '%3A00',
         'headers': {
            'X-Admin-Key': 'sdcsdcwqdqw'
         }
      };
      await request(options, function (error, response) {
         if (error) throw new Error(error);
         //console.log(response);

         const obj = JSON.parse(response.body);
         thirtyMinutesAgo = obj.data.guid;
         //console.log(thirtyMinutesAgo);
      });


   }

   async function getDatatable() {
      var options3 = {
         'method': 'GET',
         'url': 'https://widget3.bastillepost.com/counter/api/elastic/articles.php?action=popular&group=hongkong&range=1800s&pub_hour=168&size=10000',
         'headers': {
            'key': 'asxasx',
            'secret': 'qwwqssqws'
         }
      };


      await request(options3, function (error, response) {
         if (error) throw new Error(error);
         //console.log(response.body);

         const obj = JSON.parse(response.body);

         //const obj2 = JSON.parse(obj.data);


         //console.log(obj);

         var data = obj.data;

         dataLength = data.length;

         console.log(dataLength);

         for (var i = 0; i < dataLength; i++) {

            url.push(data[i].url);
            title.push(data[i].title);
            views.push(data[i].impression);

         }

         //console.log(url);

         // range += 60;
         // viewsForChart.push(minuteViews);
         // minuteViews = 0;

      });

   }

   async function getGraph() {

      // Get current date

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;
      var today2 = today;

      // Get current time

      var t = new Date(); // for now
      var currentHours = t.getHours(); // => 9
      currentHours = ("0" + currentHours).slice(-2); // adds a leading 0 if single digit
      var currentMinutes = t.getMinutes(); // =>  30
      currentMinutes = ("0" + currentMinutes).slice(-2); // adds a leading 0 if single digit
      t.getSeconds(); // => 51

      var clock1 = currentHours + ':' + currentMinutes;
      var clock2 = '00:30';
      var clockCheck;

      if (clock1 >= clock2) {
         clockCheck = true;
      } else {
         clockCheck = false;
      }

      var count = 1;
      var innerCount = 0;

      var newTime = new Date(t.setMinutes(t.getMinutes() - 1));
      var newHours = newTime.getHours();
      newHours = ("0" + newHours).slice(-2);
      var newMinutes = newTime.getMinutes();
      newMinutes = ("0" + newMinutes).slice(-2);

      var minuteUsers = 0;

      function minuteRequest(callback) {

         var options4 = {
            'method': 'GET',
            'url': 'https://www.bastillepost.com/admin/statistics/es/impressions?after=' + today + 'T' + newHours + '%3A' + newMinutes + '%3A00&before=' + today + 'T' + currentHours + '%3A' + currentMinutes + '%3A00',
            'headers': {
               'X-Admin-Key': 'wewefwedwd'

            }
         };


         request(options4, function (error, response) {
            if (error) throw new Error(error);
            //console.log(response.body);

            const obj = JSON.parse(response.body);
            minuteUsers = obj.data.guid;


            usersForChart.push(minuteUsers);

            minuteUsers = 0;

            // currentHours = newHours;
            // currentMinutes = newMinutes;

            // var newTime2 = newHours + ':' + newMinutes;
            // var minute = "00:01";
            // var result = minsToStr( strToMins(newTime2) - strToMins(minute) ); 

            // if (result.length < 5) {
            //    result = ("0" + result).slice(-5);
            // }

            // newHours = result.slice(0, 2);
            // newMinutes = result.slice(-2);


            innerCount++;

            callback(innerCount);


         });

      }

      function minuteRequest2(callback) {

         var options4 = {
            'method': 'GET',
            'url': 'https://www.bastillepost.com/admin/statistics/es/impressions?after=' + today2 + 'T' + newHours + '%3A' + newMinutes + '%3A00&before=' + today + 'T' + currentHours + '%3A' + currentMinutes + '%3A00',
            'headers': {
               'X-Admin-Key': 'dqwsadqw'

            }
         };


         request(options4, function (error, response) {
            if (error) throw new Error(error);
            //console.log(response.body);

            const obj = JSON.parse(response.body);
            minuteUsers = obj.data.guid;


            usersForChart.push(minuteUsers);
            minuteUsers = 0;


            innerCount++;

            callback(innerCount);

         });


      }


      if (clockCheck) {

         var loopArray = function() {

            minuteRequest(function (value) {

               currentHours = newHours;
               currentMinutes = newMinutes;

               var newTime2 = newHours + ':' + newMinutes;
               var minute = "00:01";
               var result = minsToStr( strToMins(newTime2) - strToMins(minute) ); 

               if (result.length < 5) {
                  result = ("0" + result).slice(-5);
               }

               newHours = result.slice(0, 2);
               newMinutes = result.slice(-2);

               if (value < 30) {
                  loopArray();
               } else {
                  res.write('data: ' + JSON.stringify({thirtyMinutesAgo: thirtyMinutesAgo, array1: usersForChart, url: url, title: title, views: views, length: dataLength}) + '\n\n');
                  console.log(usersForChart);
                  usersForChart = [];
                  url = [];
                  title = [];
                  views = [];

               }
            });

         }

         loopArray();

      } else {

         var loopArray = function() {

            minuteRequest2(function (value) {

               currentHours = newHours;
               currentMinutes = newMinutes;

               var newTime2 = newHours + ':' + newMinutes;
               var minute = "00:01";
               var result = minsToStr( strToMins(newTime2) - strToMins(minute) ); 

               if (result.length < 5) {
                  result = ("0" + result).slice(-5);
               }

               newHours = result.slice(0, 2);
               newMinutes = result.slice(-2);

               var newTime3 = newHours + ':' + newMinutes;
               var currentTime2 = currentHours + ':' + currentMinutes;

               if (midnight) {
                  midnight = false;

                  if (dd == '01') {

                     throw new Error("Error: Midnight on the first day of the month, can't resolve properly. Please refresh the app an hour later.")

                  } else {

                     if (dd <= '10') {

                        today2 = yyyy + '-' + mm + '-' + ('0' + (dd - 1));

                     } else {

                        today2 = yyyy + '-' + mm + '-' + (dd - 1);


                     }

                  }

               }

               if (midnight2) {
                  midnight2 = false;

                  if (dd == '01') {

                     throw new Error("Error: Midnight on the first day of the month, can't resolve properly. Please refresh the app an hour later.")

                  } else {

                     if (dd <= '10') {

                        today = yyyy + '-' + mm + '-' + ('0' + (dd - 1));

                     } else {

                        today = yyyy + '-' + mm + '-' + (dd - 1);


                     }

                  }

               }



               if (newTime3 === "00:00") {
                  midnight = true;
               } 

               if (currentTime2 === "00:00") {
                  midnight2 = true;
               } 


               if (value < 30) {
                  loopArray();
               } else {
                  res.write('data: ' + JSON.stringify({thirtyMinutesAgo: thirtyMinutesAgo, array1: usersForChart, url: url, title: title, views: views, length: dataLength}) + '\n\n');
                  console.log(usersForChart);
                  usersForChart = [];
                  url = [];
                  title = [];
                  views = [];

               }
            });

         }

         loopArray();

      }

   }


   async function start() {

      await getDatatable();
      await thirtyMinutes();
      await getGraph();

   }

   start();

   var interval = setInterval(start, 60000);

   // close
   res.on('close', () => {
      clearInterval(interval);
      res.end();
   });


   //if (count1 === 1) {

   //   for (var i = 0; i < minutesAgo.length; i++) {
   //      var time = parseInt(minutesAgo[i]);

   //      if (time === 0) {

   //      } else {
   //         arrayViews[time - 1] = totalViews2[time - 1];

   //      }


   //   }

   //} else {
   //   arrayViews.unshift(totalViews);
   //   arrayViews.pop();

   //   console.log(arrayViews)

   //}


})


app.get('/server-sent-events', function (req, res, next) {

   res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

   const analyticsDataClient = new BetaAnalyticsDataClient();

   var fiveMin = 300000;
   var thirtyMin = 1800000;

   var count1 = 0;
   var count2 = 0;
   var responseLength = 0;
   var arrayViews = [];
   var pageTitles = [];
   var user = [];
   var view = [];
   var previousViews;
   var minutesAgo = [];
   var jsObject = {};
   var names = [];
   var executeLoop = true;
   var pageTitles2 = [];
   var user2 = [];
   var view2 = [];
   var responseLength2 = 0;
   var timePassed = false;
   var totalViews2 = [];
   var usersFive  = [];
   var usersThirty = [];
   var device = [];
   var pageNumber = 0;
   var pageNumberArray = [];
   var pageUnique = [];
   var pageNumberIndex;
   

   for (var i = 0; i < 30; i++) {
      arrayViews.push(0);
   }

   for (var i = 0; i < 30; i++) {
      totalViews2.push(0);
   }

   function getOccurrence(array, value) {
      return array.filter((v) => (v === value)).length;
  }

   function exists(arr, search) {

      return arr.some(row => row.includes(search));

  }


   async function start(){
        const [response] = await analyticsDataClient.runRealtimeReport({
          property: `properties/${propertyId}`,
          //dateRanges: [
          //   {
          //    startDate: '2daysAgo',
          //    endDate: 'today',

          //   }
          //],
          dimensions: [
            {
               name: 'unifiedScreenName'
            },
            {
               name: 'streamName'
            },
            {
               name: 'minutesAgo'
            }, 
            {
               name: 'deviceCategory'
            }
          ],
          metrics: [
            {
              name: 'activeUsers',
            },
            {
               name: 'screenPageViews'
            }
          ],
          //minuteRanges: [
          //  {
          //    name: '5 minutes ago',
          //    startMinutesAgo: 5,
          //  }
          //],

        });

        console.log('Report result:');

        //console.log(response)

        var totalUsers = 0;
        var totalViews = 0;
        var screenName = '';

        var usersFive = 0;

        var names2d = [];
        var count2d = 0;
      

        response.rows.forEach(row => {
          //console.log(row.dimensionValues[1].value, row.dimensionValues[3].value, row.metricValues[0].value, row.metricValues[1].value);

          //console.log(row)


          minutesAgo.push(row.dimensionValues[2].value);

          device.push(row.dimensionValues[3].value)

          screenName = row.dimensionValues[0].value;

          //screenName2 = screenName.replace(/\s+/g, '');

          if (exists(names2d, screenName)) {


             var searchParam = screenName;
             var index = names2d.findIndex(x=>x.includes(searchParam))

             for (var i=0; i<4; i++) {
                
                if (i === 1) {
                   var index1 = Number(names2d[index][1]);

                   index1 += Number(row.metricValues[0].value)


                   names2d[index][1] = index1


                } else if (i === 2) {

                   var index1 = Number(names2d[index][2]);

                   index1 += Number(row.metricValues[1].value)

                   names2d[index][2] = index1
                }


             }

             //count2d++;

          } else {
             names2d.push([]);

             names2d[count2d][0] = screenName;
             names2d[count2d][1] = row.metricValues[0].value;
             names2d[count2d][2] = row.metricValues[1].value;
             names2d[count2d][3] = row.dimensionValues[2].value;

             count2d++;

             pageNumber++;

             pageNumberArray.push(pageNumber);

          }

          if (screenName === '') {
             names.push("undefined")



          } else {
             names.push(screenName.replace(/\s+/g, ''))

          }
            
           //names.push(screenName.replace(/\s+/g, ''))


          if (row.dimensionValues[0].value === '') {
            pageTitles.push('undefined');

          } else {
            pageTitles.push(row.dimensionValues[0].value);

          }

          if (pageUnique.includes(row.dimensionValues[0].value)) {

          } else {

             if (row.dimensionValues[0].value === '') {
               pageUnique.push('undefined');

             } else {
               pageUnique.push(row.dimensionValues[0].value);

             }

             //pageNumber++;

             //pageNumberArray.push(pageNumber);

          }

          //pageTitles.push(row.dimensionValues[1].value);
          user.push(row.metricValues[0].value);
          view.push(row.metricValues[1].value)

          if (row.dimensionValues[2].value === '00') {

          } else {
             var tempTime = parseInt(row.dimensionValues[2].value);

             totalViews2[tempTime - 1] += Number(row.metricValues[1].value)
          }

          var tempTime2 = parseInt(row.dimensionValues[2].value)

          if ( tempTime2 >= 1 && tempTime2 <= 5) {
             usersFive += Number(row.metricValues[0].value);
          }


          if (row.dimensionValues[2].value === '01') {

            totalViews += Number(row.metricValues[1].value);
            totalUsers += Number(row.metricValues[0].value);


             pageTitles2.push(row.dimensionValues[0].value)
             //user.push(row.metricValues[0].value);
             //view.push(row.metricValues[1].value)

             user2.push(row.metricValues[0].value);
             view2.push(row.metricValues[1].value);

            responseLength2++;

          }

          responseLength++;

        });

        console.log('total users: ' + totalUsers)
        console.log('total views: ' + totalViews)

        //console.log(names)

        count1++;
        count2++;

        if (count2 > 30) {
           //30 minutes

           //arrayViews = [];
           // for (var i = 0; i < 30; i++) {
           //    arrayViews.push(0);
           // }

           count2 = 1;
           //timePassed = true;

           //res.write('data: ' + JSON.stringify({timePassed: timePassed, namesArray: names, array1: arrayViews, resLength: responseLength, view: view, pageTitles: pageTitles, user: user}))

           //timePassed = false;
        }
        

        if (count1 === 1) {

            for (var i = 0; i < minutesAgo.length; i++) {
               var time = parseInt(minutesAgo[i]);

               if (time === 0) {

               } else {
                  arrayViews[time - 1] = totalViews2[time - 1];

               }


            }

            pageNumberIndex = 1;

        } else {
           arrayViews.unshift(totalViews);
           arrayViews.pop();

           console.log(arrayViews)

           pageNumberIndex = 1;

        }

        
       var desktop = getOccurrence(device, "desktop");
       var mobile = getOccurrence(device, "mobile");
       var tablet = getOccurrence(device, "tablet");

       //console.log(device.toString())

         




        

        var usersTotal = totalUsers;
        console.log("SENT: "+usersTotal);
        res.write('data: ' + JSON.stringify({ usersTotal: usersTotal, array1: arrayViews, resLength: responseLength, pageTitles: pageTitles, user: user, view: view, viewsTotal: totalViews, namesArray: names, count: count1, user2: user2, view2: view2, resLength2: responseLength2, pageTitles2: pageTitles2, timePassed: timePassed, namesLength: names.length, minutes: minutesAgo, device: device, usersFive: usersFive, desktop: desktop, mobile: mobile, tablet: tablet, pageNumber: pageNumberArray, pageIndex: pageNumberIndex, names2d: names2d}) + '\n\n');
        responseLength = 0;
       // res.write("arrayViews: " + arrayViews + "\n\n")
       // res.write("responseLength: " + responseLength + "\n\n")
        number++;
        pageTitles = [];
        pageTitles2 = [];
        user = [];
        view = [];
        user2 = [];
        view2 = [];
        minutesAgo = [];
        names = [];
        device = [];
        responsLength2 = 0;
        timePassed = false;
        names2d = [];
        count2d = 0;
        pageNumber = 0;
        

    };

   
   start();

   var interval = setInterval(start, 60000);

   // Runs a simple report.
   //async function runReport() {
   //}

   //runReport();

   //var interval = setInterval(function(){
   //     data = "Real-Time Update "+number;
   //     console.log("SENT: "+data);
   //     res.write("data: " + data + "\n\n")
   //     number++;
   // }, 3000);


   // close
    res.on('close', () => {
        clearInterval(interval);
        res.end();
    });

})

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
//const analyticsDataClient = new BetaAnalyticsDataClient();

// Runs a simple report.
//async function runReport() {
//  const [response] = await analyticsDataClient.runReport({
//    property: `properties/${propertyId}`,
//    dateRanges: [
//      {
//        startDate: '2020-03-31',
//        endDate: 'today',
//      },
//    ],
//    dimensions: [
//      {
//        name: 'city',
//      },
//    ],
//    metrics: [
//      {
//        name: 'activeUsers',
//      },
//    ],
//  });
//
//  console.log('Report result:');
//  response.rows.forEach(row => {
//    console.log(row.dimensionValues[0], row.metricValues[0]);
//  });
//}
//
//runReport();










