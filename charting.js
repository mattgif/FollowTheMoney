function generateSectorSupOpChart(counts) {
    // takes array of ints formatted as [# of sectors supporting, # of sectors opposing]  
    let supportOpposeChart = $('.support-oppose');
    if (counts[0] === 0 && counts[1] === 0) {
            $('.charts-support-oppose').html(
                `
                <div class="not-found">We were unable to find data on supporting/opposing interests.</div>
                `
            )
        } else {
            let chart = new Chart (supportOpposeChart, {
                type: 'bar',
                data: {
                    labels: ["Support", "Oppose"],
                    datasets: [
                        {
                            label: ["# of sectors"],
                            data: counts,
                            backgroundColor: [
                                'rgb(80, 168, 60)',
                                'rgb(145, 35, 27)',                        
                            ],
                        },
                    ],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            })
        }    
}

function generateSectorBreakdownChart(sectors,counts,disposition) {
    // generates chart showing how many orgs in which sectors support/oppose bill    
    let supportSectorBreakdown = $('.support-sector-breakdown');
    let opposeSectorBreakdown = $('.oppose-sector-breakdown');    
    let targetElement = null;
    let bgColor = null;
    let adjective = null;
    if (disposition === 'support') {
        targetElement = supportSectorBreakdown;
        bgColor = 'rgb(80, 168, 60)';
        adjective = 'supporting';

    } else {
        targetElement = opposeSectorBreakdown;
        bgColor = 'rgb(145, 35, 27)';
        adjective = 'opposing';
    }
    if (counts.reduce((a,b) => a+b,0) === 0) {
        // only creates chart if there's something to put in it
        targetElement.parent().html(
            `
            We couldn't find any sectors with more than one organization ${adjective} this bill.
            `
        )   
    } else {
        let chart = new Chart (targetElement, {
            type: 'horizontalBar',
            data: {
                labels: sectors,
                datasets: [
                    {
                        label: `# of organizations in ${adjective} sectors`,
                        data: counts,
                        backgroundColor: bgColor,
                    },                  
                ],
            },
            options: {
                scales: {       
                    xAxes: [{                    
                        ticks: {
                            beginAtZero:true,
                            stepSize: 1,
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            stepSize: 1,
                        }
                    }]
                }
            },
        })
    }
    
}