/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.98674829715618, "KoPercent": 0.01325170284381543};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8936763383348322, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8965698284914245, 500, 1500, "https:\/\/tfl.gov.uk\/plan-a-journey\/-Test2"], "isController": false}, {"data": [0.9128030625265844, 500, 1500, "Test1_CJT_T02_EnterFromPlace"], "isController": true}, {"data": [0.9973721093202523, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/BikePoint\/Search?query-Test2"], "isController": false}, {"data": [0.04563004563004563, 500, 1500, "Test2_CJT_T04_ClkPlanmyJourney"], "isController": true}, {"data": [0.9959003301032904, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/BikePoint\/Search?query-Test1"], "isController": false}, {"data": [0.956475357371453, 500, 1500, "https:\/\/securepubads.g.doubleclick.net\/pagead\/ppub_config?ippd=tfl.gov.uk-Test1"], "isController": false}, {"data": [0.9554140127388535, 500, 1500, "https:\/\/securepubads.g.doubleclick.net\/pagead\/ppub_config?ippd=tfl.gov.uk-Test2"], "isController": false}, {"data": [0.8841698841698842, 500, 1500, "https:\/\/tfl.gov.uk\/plan-a-journey\/results?InputFrom-Test2"], "isController": false}, {"data": [0.9124203821656051, 500, 1500, "https:\/\/tfl.gov.uk\/plan-a-journey\/-Test1"], "isController": false}, {"data": [0.9124173245146149, 500, 1500, "https:\/\/tfl.gov.uk\/plan-a-journey\/results?InputFrom-Test1"], "isController": false}, {"data": [0.9124203821656051, 500, 1500, "Test1_CJT_T01_Homepage"], "isController": true}, {"data": [0.6670578195007467, 500, 1500, "Test1_CJT_T04_ClkPlanmyJourney"], "isController": true}, {"data": [0.9951006496964533, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/Place\/Extra\/search?query-Test1"], "isController": false}, {"data": [0.9382239382239382, 500, 1500, "Test2_CJT_T03_EnterToPlace"], "isController": true}, {"data": [0.9939505523408733, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/Place\/Extra\/search?query-Test2"], "isController": false}, {"data": [0.9528985507246377, 500, 1500, "Test1_CJT_T03_EnterToPlace"], "isController": true}, {"data": [0.08371358371358371, 500, 1500, "https:\/\/tfl.gov.uk\/JourneyPlanner\/ResultsAsync?InputFrom-Test2"], "isController": false}, {"data": [0.9719436739918925, 500, 1500, "https:\/\/tfl.gov.uk\/JourneyPlanner\/ResultsAsync?InputFrom-Test1"], "isController": false}, {"data": [0.9692356823504364, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/StopPoint\/search\/-Test1"], "isController": false}, {"data": [0.9036440084092502, 500, 1500, "Test2_CJT_T02_EnterFromPlace"], "isController": true}, {"data": [0.9653691039803612, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/StopPoint\/search\/-Test2"], "isController": false}, {"data": [0.8965698284914245, 500, 1500, "Test2_CJT_T01_Homepage"], "isController": true}, {"data": [0.98999648999649, 500, 1500, "https:\/\/api-tigris.tfl.gov.uk\/BikePoint\/Search-Test2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 75462, 10, 0.01325170284381543, 317.38208634809786, 31, 60422, 593.0, 1319.9500000000007, 3367.9400000000096, 41.070817252769324, 1112.909322291138, 20.95084935839434], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["https:\/\/tfl.gov.uk\/plan-a-journey\/-Test2", 2857, 0, 0.0, 390.11795589779507, 115, 12478, 741.0000000000014, 1223.2999999999997, 1922.780000000008, 1.5874303519794817, 135.06226871099489, 0.7844138262711111], "isController": false}, {"data": ["Test1_CJT_T02_EnterFromPlace", 4702, 0, 0.0, 380.0618885580615, 101, 5697, 729.0, 1054.699999999999, 1712.7900000000018, 2.6160591089152976, 12.57357905309732, 4.10904308958695], "isController": true}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/BikePoint\/Search?query-Test2", 2854, 0, 0.0, 72.21969166082668, 31, 1594, 90.0, 141.5, 454.89999999999964, 1.5884889651779175, 1.2268663075590702, 0.7321941323866964], "isController": false}, {"data": ["Test2_CJT_T04_ClkPlanmyJourney", 2849, 8, 0.2808002808002808, 4101.487539487534, 296, 60422, 4790.0, 5680.0, 50165.5, 1.5550588537103902, 300.3368296699866, 2.327892789328825], "isController": true}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/BikePoint\/Search?query-Test1", 9391, 0, 0.0, 73.51229900969021, 32, 1867, 92.0, 169.0, 471.0799999999999, 5.2252342480692615, 9.10432074406451, 2.4008579648516615], "isController": false}, {"data": ["https:\/\/securepubads.g.doubleclick.net\/pagead\/ppub_config?ippd=tfl.gov.uk-Test1", 4687, 0, 0.0, 234.40558992959268, 64, 4717, 446.0, 597.5999999999995, 1199.12, 2.6147108867256144, 2.267933273304789, 0.9779631539217875], "isController": false}, {"data": ["https:\/\/securepubads.g.doubleclick.net\/pagead\/ppub_config?ippd=tfl.gov.uk-Test2", 2826, 0, 0.0, 241.4837225760795, 68, 4652, 466.3000000000002, 606.6500000000001, 1217.3000000000002, 1.5777317621521914, 1.3680049826817977, 0.590108657133095], "isController": false}, {"data": ["https:\/\/tfl.gov.uk\/plan-a-journey\/results?InputFrom-Test2", 2849, 0, 0.0, 407.82625482625446, 103, 5491, 806.0, 1193.0, 1832.0, 1.587880166044668, 137.42249792179427, 0.9303985347917977], "isController": false}, {"data": ["https:\/\/tfl.gov.uk\/plan-a-journey\/-Test1", 4710, 0, 0.0, 343.8002123142248, 114, 4071, 666.8000000000011, 949.8999999999996, 1734.2400000000052, 2.6171886504030524, 222.6772019869171, 1.2932592354530708], "isController": false}, {"data": ["https:\/\/tfl.gov.uk\/plan-a-journey\/results?InputFrom-Test1", 4687, 0, 0.0, 351.65969703435087, 98, 14207, 688.0, 1043.3999999999978, 1731.0, 2.611537792913466, 226.08589302511996, 1.4689900085138248], "isController": false}, {"data": ["Test1_CJT_T01_Homepage", 4710, 0, 0.0, 343.8002123142248, 114, 4071, 666.8000000000011, 949.8999999999996, 1734.2400000000052, 2.6169516236212385, 222.65703513323533, 1.2931421108909635], "isController": true}, {"data": ["Test1_CJT_T04_ClkPlanmyJourney", 4687, 0, 0.0, 852.25773415831, 264, 59529, 1449.1999999999998, 1937.7999999999984, 3681.479999999994, 2.6112046138152616, 421.0814758114679, 3.794406704450301], "isController": true}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/Place\/Extra\/search?query-Test1", 9389, 0, 0.0, 76.18915752476303, 32, 3939, 93.0, 185.5, 487.10000000000036, 5.224609809734947, 10.824506735818042, 2.410776999335586], "isController": false}, {"data": ["Test2_CJT_T03_EnterToPlace", 2849, 0, 0.0, 282.2320112320112, 103, 5992, 543.0, 767.5, 1739.5, 1.5879111416295235, 11.633123252858825, 2.4811111587961303], "isController": true}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/Place\/Extra\/search?query-Test2", 5703, 0, 0.0, 80.71330878485013, 31, 4628, 95.0, 207.80000000000018, 536.8400000000001, 3.1741879466571676, 6.576375092705713, 1.4646562296499654], "isController": false}, {"data": ["Test1_CJT_T03_EnterToPlace", 4692, 0, 0.0, 252.6913895993183, 82, 4235, 445.6999999999998, 697.0, 1454.0699999999997, 2.612400886612782, 19.136370109299634, 4.081364193362765], "isController": true}, {"data": ["https:\/\/tfl.gov.uk\/JourneyPlanner\/ResultsAsync?InputFrom-Test2", 2849, 8, 0.2808002808002808, 3454.1249561249506, 69, 60009, 3951.0, 4588.0, 49851.5, 1.555188729712675, 164.43111112083446, 0.8398626636045988], "isController": false}, {"data": ["https:\/\/tfl.gov.uk\/JourneyPlanner\/ResultsAsync?InputFrom-Test1", 4687, 0, 0.0, 266.19223383827466, 61, 59224, 323.1999999999998, 472.59999999999945, 1901.8399999999938, 2.6116702152022944, 192.79390549279603, 1.3491929139082166], "isController": false}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/StopPoint\/search\/-Test1", 9394, 0, 0.0, 166.8070044709391, 33, 5421, 274.0, 547.0, 1256.0, 5.2265632258922405, 11.769525510235306, 3.376347577651518], "isController": false}, {"data": ["Test2_CJT_T02_EnterFromPlace", 2854, 0, 0.0, 401.8248072880164, 151, 7273, 768.5, 1215.5, 1818.7999999999956, 1.588365197104211, 7.637260006902487, 2.4957808614655033], "isController": true}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/StopPoint\/search\/-Test2", 5703, 0, 0.0, 179.57724004909724, 32, 5677, 296.0, 591.6000000000004, 1273.0, 3.1741278801189283, 7.148020897455021, 2.0504782880720027], "isController": false}, {"data": ["Test2_CJT_T01_Homepage", 2857, 0, 0.0, 390.11830591529593, 115, 12478, 741.0000000000014, 1223.2999999999997, 1922.780000000008, 1.587289241101291, 135.05026266907657, 0.7843440976535676], "isController": true}, {"data": ["https:\/\/api-tigris.tfl.gov.uk\/BikePoint\/Search-Test2", 2849, 0, 0.0, 91.37767637767625, 31, 3712, 132.0, 280.0, 624.0, 1.588022663742193, 4.309682600136283, 0.7273267864209848], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503\/Service Unavailable", 2, 20.0, 0.0026503405687630863], "isController": false}, {"data": ["504\/Gateway Timeout", 6, 60.0, 0.007951021706289259], "isController": false}, {"data": ["503", 1, 10.0, 0.0013251702843815431], "isController": false}, {"data": ["504", 1, 10.0, 0.0013251702843815431], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 75462, 10, "504\/Gateway Timeout", 6, "503\/Service Unavailable", 2, "503", 1, "504", 1, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Test2_CJT_T04_ClkPlanmyJourney", 17, 2, "503", 1, "504", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https:\/\/tfl.gov.uk\/JourneyPlanner\/ResultsAsync?InputFrom-Test2", 2849, 8, "504\/Gateway Timeout", 6, "503\/Service Unavailable", 2, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
