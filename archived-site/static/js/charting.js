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
                    datasets: [{
                        data: counts,
                        backgroundColor: [
                            'rgb(80, 168, 60)',
                            'rgb(145, 35, 27)',                        
                        ],
                    }],
                    labels: [
                        "Support", 
                        "Oppose"
                    ],
                },
                options: {
                    title: {
                        display: true,
                        text: "# of special interest sectors supporting/opposing",                        
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true,
                                stepSize: 1,
                            }
                        }]
                    },
                    legend: {
                        display: false,
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
        targetElement.parent().html('')   
    } else {
        let chart = new Chart (targetElement, {
            type: 'horizontalBar',
            data: {
                labels: sectors,
                datasets: [
                    {                        
                        data: counts,
                        backgroundColor: bgColor,
                    },                  
                ],
            },
            options: {
                title: {
                    display: true,
                    text: `# of special interest groups ${adjective}`,                    
                },
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
                },
                legend: {
                    display: false,
                }
            },
        })
    }    
}

function generateMissedVoteChart(missed_votes_pct) {    
    const missedVotes = round(missed_votes_pct,2);
    const presentVotes = round((100 - missed_votes_pct),2);
    const missedVoteChart = $('.missed-votes')
    let chart = new Chart (missedVoteChart, {
        type: 'pie',
        data: {
            datasets: [{
                data: [missedVotes,presentVotes],
                backgroundColor: ['#ffd154','#a454ff']
            }],
            labels: [
                missedVotes + '% missed',
                presentVotes + '% present',
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Missed vote percentage'
            },
        }
    })
}

function generatePartyLoyaltyChart(votes_with_party_pct) {
    const partyVotes = round(votes_with_party_pct,2);
    const dissentingVotes = round((100 - partyVotes),2);
    const partyLoyaltyChart = $('.party-loyalty')
    let chart = new Chart (partyLoyaltyChart, {
        type: 'pie',
        data: {
            datasets: [{
                data: [partyVotes,dissentingVotes],
                backgroundColor: ['#2e4aff','#ff902e'],
            }],
            labels: [
                partyVotes + '% of votes with party',
                dissentingVotes + '% of votes across party line',
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Percentage of votes with party',
                position: 'top',
            },
        },
    })

}

function round(value,decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}