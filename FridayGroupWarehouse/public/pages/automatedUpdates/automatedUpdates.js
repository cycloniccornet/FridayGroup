let today = new Date();
let currentDate = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
let futureDay = new Date(Date.now() + 12096e5)          // 12096e5 is 2 weeks in milliseconds.
let futureDate = futureDay.getFullYear() + '-' + (futureDay.getMonth()+1) + '-' + (futureDay.getDate());

let listOfProducts = [];

fetch('https://pakkemodelapi.azurewebsites.net/api/bookings?start='+currentDate+'&end='+futureDate, {
    headers: {'content-type': 'application/json'}
})
    .then(result => result.json())
    .then(result => {
        let ids = "";
        for (let i = 0;i<result.length;i++) {
            ids += result[i].id;
            if (i+1 === result.length) {
                break;
            }
            ids += ',';
        }
        fetch('https://pakkemodelapi.azurewebsites.net/api/packinglists/packinglistVCK/'+ids)
            .then(result => result.json())
            .then(result => {
                let numberOfBookings = 0;
                let numberOfParticipants = 0;
                for (let i = 0;i<result.length;i++) {
                    numberOfBookings++;
                    numberOfParticipants += result[i].bookingInfo[0].persons;
                    for (let j = 0;j<result[i].vCKtotals.length;j++) {
                        for (let k = 0;k<result[i].vCKtotals[j].vCKItemtotals.length;k++) {
                            let currentName = result[i].vCKtotals[j].vCKItemtotals[k].componentName;
                            const found = listOfProducts.find((element) => element.Name === currentName);
                            if (found !== undefined) {
                                const foundIndex = listOfProducts.findIndex((element) => element.Name === currentName);
                                listOfProducts[foundIndex].Amount += result[i].vCKtotals[j].vCKItemtotals[k].amount;
                            } else {
                                listOfProducts.push({
                                    Name: result[i].vCKtotals[j].vCKItemtotals[k].componentName,
                                    Amount: result[i].vCKtotals[j].vCKItemtotals[k].amount,
                                    UnitSize: result[i].vCKtotals[j].vCKItemtotals[k].oriUnit
                                })
                            }
                        }
                    }
                }
                $('#packing_list_products').empty().append('<h1>Produkt liste fra bookinger</h1>' +
                    '<h5>Viser liste over produkter der skal bruges til bookinger de næste <span style="color: blue">14 dage</span></h5>' +
                    '<h6>Antal bookinger: <span style="color: blue">'+numberOfBookings+' stk.</span></h6>' +
                    '<h6>Total antal personer: <span style="color: blue">'+numberOfParticipants+' personer</span></h6>' +
                    '<table id="booking_table">' +
                        '<th>Produkt</th>' +
                        '<th>Antal</th>' +
                    '</table>')
                for (let i = 0;i<listOfProducts.length;i++) {
                    $('#booking_table').append('' +
                        '<tr>' +
                            '<td>'+listOfProducts[i].Name+'</td>' +
                            '<td>'+Math.round(listOfProducts[i].Amount)+' '+listOfProducts[i].UnitSize+'</td>' +
                        '</tr>')
                }
            })
    })
    .catch(
        error => console.log(error)
    )