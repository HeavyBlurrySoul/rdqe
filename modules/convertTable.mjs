export const name = 'convertTable';

export function convert(tdata) {
    var convertedIntoArray = [];
            var finalArray = [];
            $("table tr").each(function () {
                var rowDataArray = [];
                var actualData = $(this).find('td');
                if (actualData.length > 0) {
                    actualData.each(function () {
                        rowDataArray.push($(this).text().split(" ").join("").replace(/\n/g, ''));
                    });
                    convertedIntoArray.push(rowDataArray);
                }
            });
            //Manipulation of data
            document.getElementById("odiv1").innerHTML = ""
            convertedIntoArray.forEach(function (item) {
                function createTableRow(name, pdssr, pdpsr, pda, pdc, iva, ivc, fc, ft, mt, rng, azim) {
                    var tempArr = [name, document.getElementById('datum').value, pdssr, pdpsr, pda, pdc, iva, ivc, fc, ft, mt, rng, azim]
                    var mytable = "<tr>";
                    for (var CELL of tempArr) { mytable += "<td>" + CELL + "</td>"; }
                    mytable += "</tr>";
                    document.getElementById('jj').innerHTML = document.getElementById('jj').innerHTML + mytable.split(" ").join("").normalize()

                }
                switch (item[0]) {
                    case "Semmerzake":
                        item[0] = "S723E"
                        createTableRow(item[0], item[2], item[3], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[19], item[21])
                        break;
                    case "EBBL_UPGRADE":
                        item[0] = "EBBL"
                        createTableRow(item[0], item[2], item[3], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[19], item[21])
                        break;
                    case "EBBE_NEW":
                        item[0] = "EBBE"
                        createTableRow(item[0], "", item[3], "", "", "", "", "", "", "", item[19], item[21])
                        break;
                    case "Erbeskopf":
                        item[0] = "GEEK"
                        createTableRow(item[0], item[2], item[3], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[19], item[21])
                        break;
                    case "Marienbaum":
                        item[0] = "GEMB"
                        createTableRow(item[0], item[1], item[3], item[4], item[5], item[6], item[7], item[8], item[14], item[15], item[19], item[21])
                        break;
                    case "Florennes_new":
                        item[0] = "EBFS"
                        createTableRow(item[0], item[2], item[3], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[19], item[21])
                        break;
                    case "EBSH":
                        createTableRow(item[0], "", item[3], "", "", "", "", "", "", "", item[19], item[21])
                        break;
                    case "EBEZ":
                        console.log(item[21])
                        item[0] = "EBEZ"
                        createTableRow(item[0], item[2], item[3], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[19], item[21])
                        break;

                    default:
                        break;
                }

            });

            console.log(finalArray)
}