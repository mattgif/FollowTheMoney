const PAGE_CACHE = {
	modal_open: false,
	congress_populated: false,
	congress_populating: false,
	currently_displayed: null,
	searchTermResults: {
		b: {},
		l: {},
	},
	maplight: {},
	members: {
		recent_bills: {},
		by_id: {},
	},

}

const categoryCodes = {
	Catcode: "Catname",
	A0000: "Agriculture",
	A1000: "Crop production & basic processing",
	A1100: "Cotton",
	A1200: "Sugar cane & sugar beets",
	A1300: "Tobacco & Tobacco products",
	A1400: "Vegetables, fruits and tree nut",
	A1500: "Wheat, corn, soybeans and cash grain",
	A1600: "Other commodities (incl rice, peanuts, honey)",
	A2000: "Milk & dairy producers",
	A2300: "Poultry & eggs",
	A3000: "Livestock",
	A3100: "Animal feed & health products",
	A3200: "Sheep and Wool Producers",
	A3300: "Feedlots & related livestock services",
	A3500: "Horse breeders",
	A4000: "Agricultural services & related industries",
	A4100: "Agricultural chemicals (fertilizers & pesticides)",
	A4200: "Farm machinery & equipment",
	A4300: "Grain traders & terminals",
	A4500: "Veterinarians",
	A5000: "Forestry & Forest Products",
	A5200: "Paper & pulp mills and paper manufacturing",
	A6000: "Farm organizations & cooperatives",
	A6500: "Farm bureaus",
	A8000: "Florists & Nursery Services",
	B0000: "Construction & Public Works",
	B0500: "Builders associations",
	B1000: "Public works, industrial & commercial construction",
	B1200: "Dredging Contractors",
	B1500: "Construction, unclassified",
	B2000: "Residential construction",
	B2400: "Mobile home construction",
	B3000: "Special trade contractors",
	B3200: "Electrical contractors",
	B3400: "Plumbing, heating & air conditioning",
	B3600: "Landscaping & Excavation Svcs",
	B4000: "Engineering, architecture & construction mgmt svcs",
	B4200: "Architectural services",
	B4300: "Surveying",
	B4400: "Engineers - type unknown",
	B5000: "Building materials",
	B5100: "Stone, clay, glass & concrete products",
	B5200: "Lumber and wood products",
	B5300: "Plumbing & pipe products",
	B5400: "Other construction-related products",
	B5500: "Electrical Supply",
	B6000: "Construction equipment",
	C0000: "Communications & Electronics",
	C1000: "Printing and publishing (printed & online)",
	C1100: "Book, newspaper & periodical publishing",
	C1300: "Commercial printing & typesetting",
	C1400: "Greeting card publishing",
	C2000: "Entertainment Industry/Broadcast & Motion Pictures",
	C2100: "Commercial TV & radio stations",
	C2200: "Cable & satellite TV production",
	C2300: "TV production",
	C2400: "Motion Picture production & distribution",
	C2600: "Recorded Music & music production",
	C2700: "Movie Theaters",
	C2800: "Bands, orchestras & other live music production",
	C2900: "Live theater & other entertainment productions",
	C4000: "Telecommunications",
	C4100: "Telephone utilities",
	C4200: "Long-distance telephone & telegraph service",
	C4300: "Cell/wireless service providers",
	C4400: "Satellite communications",
	C4500: "Cable distributors & service providers",
	C4600: "Other Communications Services",
	C5000: "Electronics manufacturing & services",
	C5100: "Computer manufacture & services",
	C5110: "Computer components & accessories",
	C5120: "Computer software",
	C5130: "Data processing & computer services",
	C5200: "Telecommunications Devices",
	C5300: "Other Communication Electronics",
	C5400: "Industrial Electronics",
	C6000: "Internet & Online Services",
	C6100: "Online Entertainment",
	C6200: "Social Media",
	C6300: "Search Engine/Email Services",
	C6400: "Vendors",
	C6500: "Hosting/Cloud Services",
	D0000: "Defense",
	D2000: "Defense aerospace contractors",
	D3000: "Defense electronic contractors",
	D4000: "Defense Research & Development",
	D5000: "Defense shipbuilders",
	D6000: "Homeland Security contractors",
	D8000: "Ground-based & other weapons systems",
	D9000: "Defense-related services",
	E0000: "Energy, Natural Resources and Environment",
	E1000: "Energy production & distribution",
	E1100: "Oil & Gas",
	E1110: "Major (multinational) oil & gas producers",
	E1120: "Independent oil & gas producers",
	E1140: "Natural Gas transmission & distribution",
	E1150: "Oilfield service, equipment & exploration",
	E1160: "Petroleum refining & marketing",
	E1170: "Gasoline service stations",
	E1180: "Fuel oil dealers",
	E1190: "LPG/Liquid Propane dealers & producers",
	E1200: "Mining",
	E1210: "Coal mining",
	E1220: "Metal mining & processing",
	E1230: "Non-metallic mining",
	E1240: "Mining services & equipment",
	E1300: "Nuclear energy",
	E1320: "Nuclear plant construction, equipment & svcs",
	E1500: "Alternate energy production & services",
	E1600: "Electric Power utilities",
	E1610: "Rural electric cooperatives",
	E1620: "Gas & Electric Utilities",
	E1630: "Independent power generation & cogeneration",
	E1700: "Power plant construction & equipment",
	E2000: "Environmental services, equipment & consulting",
	E3000: "Waste management",
	E4000: "Fisheries & wildlife",
	E4100: "Fishing",
	E4200: "Hunting & wildlife",
	E5000: "Water Utilities",
	F0000: "Finance, Insurance & Real Estate",
	F1000: "Banks & lending institutions",
	F1100: "Commercial banks & bank holding companies",
	F1200: "Savings banks & Savings and Loans",
	F1300: "Credit unions",
	F1400: "Credit agencies & finance companies",
	F1410: "Student loan companies",
	F1420: "Payday lenders",
	F2000: "Securities, commodities & investment",
	F2100: "Security brokers & investment companies",
	F2110: "Discount & Online Brokers",
	F2200: "Commodity brokers/dealers",
	F2300: "Investment banking",
	F2400: "Stock exchanges",
	F2500: "Venture capital",
	F2600: "Private Equity & Investment Firms",
	F2700: "Hedge Funds",
	F3000: "Insurance",
	F3100: "Insurance companies, brokers & agents",
	F3200: "Accident & health insurance",
	F3300: "Life insurance",
	F3400: "Property & casualty insurance",
	F4000: "Real estate",
	F4100: "Real Estate developers & subdividers",
	F4200: "Real estate agents",
	F4300: "Title insurance & title abstract offices",
	F4400: "Mobile home dealers & parks",
	F4500: "Building operators and managers",
	F4600: "Mortgage bankers and brokers",
	F4700: "Other real estate services",
	F5000: "Financial services & consulting",
	F5100: "Accountants",
	F5200: "Credit reporting services & collection agencies",
	F5300: "Tax return services",
	F5500: "Other financial services",
	F7000: "Investors",
	G0000: "General commerce",
	G1000: "General business associations",
	G1100: "Chambers of commerce",
	G1200: "Small business associations",
	G1300: "Pro-business associations",
	G1310: "Business tax coalitions",
	G1400: "International trade associations",
	G2000: "Food & Beverage Products and Services",
	G2100: "Food and kindred products manufacturing",
	G2110: "Artificial sweeteners and food additives",
	G2200: "Confectionery processors & manufacturers",
	G2300: "Meat processing & products",
	G2350: "Fish Processing",
	G2400: "Food stores",
	G2500: "Food wholesalers",
	G2600: "Beverages (non-alcoholic)",
	G2700: "Beverage bottling & distribution",
	G2800: "Alcohol",
	G2810: "Beer",
	G2820: "Wine & distilled spirits manufacturing",
	G2840: "Liquor stores",
	G2850: "Liquor wholesalers",
	G2860: "Marijuana Production, Sales & Paraphernalia",
	G2900: "Restaurants & drinking establishments",
	G2910: "Food catering & food services",
	G3000: "Wholesale trade",
	G3500: "Import/Export services",
	G4000: "Retail trade",
	G4100: "Apparel & accessory stores",
	G4200: "Consumer electronics & computer stores",
	G4300: "Department, variety & convenience stores",
	G4400: "Furniture & appliance stores",
	G4500: "Hardware & building materials stores",
	G4600: "Miscellaneous retail stores",
	G4700: "Catalog & mail order houses",
	G4800: "Direct sales",
	G4850: "Vending Machine Sales & Services",
	G4900: "Drug stores",
	G5000: "Services",
	G5100: "Beauty & barber shops",
	G5200: "Business services",
	G5210: "Advertising & public relations services",
	G5220: "Direct mail advertising services",
	G5230: "Outdoor advertising services",
	G5240: "Commercial photography, art & graphic design",
	G5250: "Employment agencies",
	G5260: "Political consultants/advisers",
	G5270: "Management consultants & services",
	G5280: "Marketing research services",
	G5290: "Security services",
	G5300: "Equipment rental & leasing",
	G5400: "Funeral services",
	G5500: "Laundries & dry cleaners",
	G5600: "Miscellaneous repair services",
	G5700: "Pest control",
	G5800: "Physical fitness centers",
	G6000: "Recreation/Entertainment",
	G6100: "Amusement/recreation centers",
	G6400: "Professional sports, arenas & related equip & svcs",
	G6500: "Casinos, racetracks & gambling",
	G6550: "Indian Gaming",
	G6700: "Amusement parks",
	G6800: "Video rental",
	G7000: "Correctional facilities constr & mgmt/for-profit",
	H0000: "Health, Education & Human Resources",
	H1000: "Health professionals",
	H1100: "Physicians",
	H1110: "Psychiatrists & psychologists",
	H1120: "Optometrists & Ophthalmologists",
	H1130: "Other physician specialists",
	H1400: "Dentists",
	H1500: "Chiropractors",
	H1700: "Other non-physician health practitioners",
	H1710: "Nurses",
	H1750: "Pharmacists",
	H2000: "Health care institutions",
	H2100: "Hospitals",
	H2200: "Nursing homes",
	H2300: "Drug & alcohol treatment hospitals",
	H3000: "Health care services",
	H3100: "Home care services",
	H3200: "Outpatient health services (incl drug & alcohol)",
	H3300: "Optical services (glasses & contact lenses)",
	H3400: "Medical laboratories",
	H3500: "AIDS treatment & testing",
	H3700: "HMOs",
	H3800: "Mental Health Services",
	H3900: "Health care Consultants",
	H4000: "Health care products",
	H4100: "Medical Devices & Supplies",
	H4200: "Personal health care products",
	H4300: "Pharmaceutical manufacturing",
	H4400: "Pharmaceutical wholesale",
	H4500: "Biotech products & research",
	H4600: "Nutritional & dietary supplements",
	H4700: "Pharmaceutical cannabis",
	H5000: "Education",
	H5100: "Schools & colleges",
	H5150: "Medical schools",
	H5170: "Law schools",
	H5200: "Technical, business and vocational schools & svcs",
	H5300: "For-profit Education",
	H6000: "Welfare & Social Work",
	J0000: "Ideological & Single Issue PACs",
	J1000: "General Ideological",
	J1100: "Republican/Conservative",
	J1110: "Christian Conservative",
	J1200: "Democratic/Liberal",
	J1300: "Third-party committees",
	J2000: "Leadership committees",
	J2100: "Democratic leadership PAC",
	J2200: "Republican leadership PAC",
	J2300: "Democratic officials, candidates & former members",
	J2400: "Republican officials, candidates & former members",
	J2500: "Non-Federal candidate committees",
	J3000: "Consumer groups",
	J4000: "Fiscal & tax policy",
	J5000: "Foreign policy",
	J5100: "Pro-Israel",
	J5200: "Anti-Castro",
	J5300: "Puerto Rico statehood policy",
	J5400: "Pro-Arab",
	J6100: "Anti-Guns",
	J6200: "Pro-Guns",
	J6500: "Militias & Anti-Government Groups",
	J7000: "Human Rights",
	J7120: "Abortion policy/Anti-Abortion",
	J7150: "Abortion policy/Pro-Abortion Rights",
	J7200: "Elderly issues/Social Security",
	J7210: "Legalization of Doctor-Assisted Suicide",
	J7300: "Gay & lesbian rights & issues",
	J7400: "Women's issues",
	J7500: "Minority/Ethnic Groups",
	J7510: "Native American Tribes",
	J7600: "Animal Rights",
	J7700: "Children's rights",
	J8000: "Labor, anti-union",
	J9000: "Other single-issue or ideological groups",
	J9100: "Term limits",
	JD100: "Defense policy, hawks",
	JD200: "Defense policy, doves",
	JE300: "Environmental policy",
	JH100: "Health & welfare policy",
	JW100: "Pro-resource development groups",
	K0000: "Legal Services",
	K1000: "Attorneys & law firms",
	K1100: "Trial lawyers & law firms",
	K1200: "Corporate lawyers & law firms",
	K2000: "Lobbyists & Public Relations",
	K2100: "Registered Foreign Agents",
	L0000: "Labor Unions",
	L1000: "Civil service & government unions",
	L1100: "Federal employees unions",
	L1200: "State & local govt employee unions",
	L1300: "Teachers unions",
	L1400: "Police & firefighters unions & associations",
	L1500: "US Postal Service unions & associations",
	L5000: "Other unions",
	LA100: "Agricultural labor unions",
	LB100: "Building trades unions",
	LC100: "Communications & hi-tech unions",
	LC150: "IBEW (Intl Brotherhood of Electrical Workers)",
	LD100: "Defense-related unions",
	LE100: "Mining unions",
	LE200: "Energy-related unions (non-mining)",
	LG000: "General commercial unions",
	LG100: "Food service & related unions",
	LG200: "Retail trade unions",
	LG300: "Commercial service unions",
	LG400: "Entertainment unions",
	LG500: "Other commercial unions",
	LH100: "Health worker unions",
	LM100: "Manufacturing unions",
	LM150: "Automotive Manufacturing union",
	LT000: "Transportation unions",
	LT100: "Air transport unions",
	LT300: "Teamsters union",
	LT400: "Railroad unions",
	LT500: "Merchant marine & longshoremen unions",
	LT600: "Other transportation unions",
	M0000: "Manufacturing",
	M1000: "Chemicals",
	M1100: "Explosives",
	M1300: "Household cleansers & chemicals",
	M1400: "Manmade fibers",
	M1500: "Plastics & Rubber processing & products",
	M1600: "Paints, Solvents & Coatings",
	M1700: "Adhesives & Sealants",
	M2000: "Heavy industrial manufacturing",
	M2100: "Steel",
	M2200: "Smelting & non-petroleum refining",
	M2250: "Aluminum mining/processing",
	M2300: "Industrial/commercial equipment & materials",
	M2400: "Recycling of metal, paper, plastics, etc.",
	M3000: "Personal products manufacturing",
	M3100: "Clothing & accessories",
	M3200: "Shoes & leather products",
	M3300: "Toiletries & cosmetics",
	M3400: "Jewelry",
	M3500: "Toys",
	M3600: "Sporting goods sales & manufacturing",
	M4000: "Household & office products",
	M4100: "Furniture & wood products",
	M4200: "Office machines",
	M4300: "Household appliances",
	M5000: "Fabricated metal products",
	M5100: "Hardware & tools",
	M5200: "Electroplating, polishing & related services",
	M5300: "Small arms & ammunition",
	M6000: "Electrical lighting products",
	M7000: "Paper, glass & packaging materials",
	M7100: "Paper packaging materials",
	M7200: "Glass products",
	M7300: "Metal cans & containers",
	M8000: "Textiles & fabrics",
	M9000: "Precision instruments",
	M9100: "Optical instruments & lenses",
	M9200: "Photographic equipment & supplies",
	M9300: "Clocks & watches",
	T0000: "Transportation",
	T1000: "Air transport",
	T1100: "Airlines",
	T1200: "Aircraft manufacturers",
	T1300: "Aircraft parts & equipment",
	T1400: "General aviation (private pilots)",
	T1500: "Air freight",
	T1600: "Aviation services & airports",
	T1700: "Space vehicles & components",
	T2000: "Automotive, Misc",
	T2100: "Auto manufacturers",
	T2200: "Truck/Automotive parts & accessories",
	T2300: "Auto dealers, new & used",
	T2310: "Auto dealers, foreign imports",
	T2400: "Auto repair",
	T2500: "Car rental agencies",
	T3000: "Trucking",
	T3100: "Trucking companies & services",
	T3200: "Truck & trailer manufacturers",
	T4000: "Buses & Taxis",
	T4100: "Bus services",
	T4200: "Taxicabs",
	T5000: "Railroad transportation",
	T5100: "Railroads",
	T5200: "Manufacturers of railroad equipment",
	T5300: "Railroad services",
	T6000: "Sea transport",
	T6100: "Ship building & repair",
	T6200: "Sea freight & passenger services",
	T6250: "Cruise ships & lines",
	T7000: "Freight & delivery services",
	T7100: "Express delivery services",
	T7200: "Warehousing",
	T8000: "Recreational transport",
	T8100: "Motorcycles, snowmobiles & other motorized vehicle",
	T8200: "Motor homes & camper trailers",
	T8300: "Pleasure boats",
	T8400: "Bicycles & other non-motorized recreational transp",
	T9000: "Lodging & tourism",
	T9100: "Hotels & motels",
	T9300: "Resorts",
	T9400: "Travel agents",
	X0000: "Other",
	X1200: "Retired",
	X3000: "Civil servant/public employee",
	X3100: "Public official (elected or appointed)",
	X3200: "Courts & Justice System",
	X3300: "Municipal & county government organizations",
	X3500: "Public school teachers, administrators & officials",
	X3700: "US Postal Service",
	X4000: "Non-Profits",
	X4100: "Non-profit foundations",
	X4110: "Philanthropists",
	X4200: "Museums, art galleries, libraries, etc.",
	X5000: "Military",
	X7000: "Churches, clergy & religious organizations",
	X8000: "International Organizations",
	X9000: "Foreign Governments",
	Y0000: "Unknown",
	Y1000: "Homemakers, students & other non-income earners",
	Y2000: "No employer listed or discovered",
	Y3000: "Generic occupation - impossible to assign category",
	Y4000: "Employer listed but category unknown",
	Z1000: "Candidate Committees",
	Z1100: "Republican Candidate Committees",
	Z1200: "Democratic Candidate Committees",
	Z1300: "Third-Party Candidate Committees",
	Z1400: "Unknown-Party Candidate Committees",
	Z4100: "Republican Joint Candidate Committee",
	Z4200: "Democratic Joint Candidate Committee",
	Z4300: "Third-Party Joint Candidate Committee",
	Z4400: "Liberal Non-party Joint Fundraising Committee",
	Z4500: "Conservative Non-party Joint Fundraising Committee",
	Z5000: "Party Committees",
	Z5100: "Republican Party Committees",
	Z5200: "Democratic Party Committees",
	Z5300: "Third-Party Party Committees",
	Z9000: "Candidate contribution to his/her own campaign",
	Z9100: "Transfer between national party committees",
	Z9500: "Transfer from intermediary ( type 24I or 24T)",
	Z9600: "Non-Contribution, Miscellaneous",
	Z9700: "Unitemized (small) contributions",
	Z9800: "Public Funding",
	Z9999: "Internal Transfer and other non-contributions",
}

const PROPUBLICA_ENDPOINT = 'https://api.propublica.org/congress/v1/bills/search.json';

// bill functionality
// depends on main.js

function displayBill(bill) {	
	clearContent();		
	let summary = getBillSummary(bill);
	let datefield = relevantBillDateType(bill);

	// handlebars context dic and calls below
	let context = {
		title: bill.title,
		date: datefield,
		sponsor_id: bill.sponsor_id,
		sponsor_uri: bill.sponsor_uri,
		sponsor_title: bill.sponsor_title,
		sponsor: bill.sponsor_name,
		sponsor_party: bill.sponsor_party,
		party_icon: settings.party_icon[bill.sponsor_party],
		sponsor_state: bill.sponsor_state,
		summary: summary,
	}

	PAGE_CACHE.currently_displayed = bill.bill_id;
	let source = $('#bill_details_template').html();
	let template = Handlebars.compile(source);
	let html = template(context);

	$('.detail-view').html(html);

	createMapLightCharts(bill.bill_id);
	handleReturnToResults();
	// retrieves results info from cache when 'return' link is clicked
}

function displayBillResults(data) {	
	let resultCount = data.results[0].num_results;
	let resultCountText = `${resultCount} ${pluralize(resultCount,'result')} found`;
	if (resultCount > 0) {		
		const results = data.results[0].bills.map((item) => renderBillResults(item));
		$('.results').html(results);
	} else {
		// no results were found
		$('.results').html('')
		resultCountText = 'No results found';
	}
	$('.results').prepend(
		`
		<div class="results-count">
			${resultCountText}
		</div>
		`
	);
	PAGE_CACHE.results = $('.results').html();
	// stores results page in variable so user can navigate back to it w/o making another external call
	let searchTerm = PAGE_CACHE.currentSearchTerm;
	if (!PAGE_CACHE.searchTermResults['b'][searchTerm]) {
		PAGE_CACHE.searchTermResults['b'][searchTerm] = data;
	}
	// cache results in case same search term is used again
}

function getBillDataFromPropublica(searchTerm,callback) {	
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: PROPUBLICA_ENDPOINT,
		data: {
			query: searchTerm,
		},
		datatype: 'jsonp',
		type: 'GET',
		success: callback,
	})
}


function getBillSummary(billObj) {
	// apparently not all bills have summaries. there should be a law or something!
	if (billObj.summary_short) {		
		return billObj.summary_short;
	} else if (billObj.summary) {
		return billObj.summary;
	} else {
		return 'No summary available.';
	}
}

function handleBillClick() {	
	$('body').on('click','.bill-request', function(e) {				
		e.preventDefault();
		e.stopPropagation();
		let bill_id = $(this).attr('id');
		if (PAGE_CACHE[bill_id]) {
			displayBill(PAGE_CACHE[bill_id]);	
		} else {			
			let cached_uri = bill_id + "_uri"
			let url = PAGE_CACHE[cached_uri];			
			getSpecificBill(url,(data) => {							
				let bill = data.results[0];
				PAGE_CACHE[bill.bill_id] = bill;
				PAGE_CACHE[bill.bill_id].sponsor_name = bill.sponsor;
				// Propublica returns one key when requesting a specific bill, and the other when getting serach results
				displayBill(PAGE_CACHE[bill.bill_id])
			})
		};		
	});
}

function getSpecificBill(url, callback) {	
	$.ajax({
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		url: url,
		datatype: 'json',
		type: 'GET',
		success: callback,
	});
} 

function renderBillResults(item) {
	// returns html used to display bill results
	const title = renderTitle(item);	
	const context = {
		bill_uri: item.bill_uri,		
		datefield: relevantBillDateType(item),
		bill_id: item.bill_id,
		number: item.number, 
		sponsor_uri: item.sponsor_uri,
		sponsor_id: item.sponsor_id,
		sponsor: item.sponsor_name,
		sponsor_title: item.sponsor_title,
		sponsor_party: item.sponsor_party,
		party_icon: settings.party_icon[item.sponsor_party],
		state: item.sponsor_state,
		subject: (item.primary_subject) ? `Subject: ${item.primary_subject}` : '',
		title: title,
	}
	PAGE_CACHE[context.bill_id] = item;
	// caches bill data for retrieval
	let source = $('#bill_result_template').html();
	let template = Handlebars.compile(source);
	let html = template(context);
	return html
}

function relevantBillDateType(billObj) {
	// returns str representing date enacted, if the bill was enacted, str reprenting introduction date otherwise
	return (billObj.enacted) ? `Enacted: ${billObj.enacted}` : `Introduced: ${billObj.introduced_date}`;	
}

function renderTitle(billItem) {
	// makes sure bill titles are reasonable length
	let title = billItem.short_title ? billItem.short_title : billItem.title;
	if (title.length > settings.titleLength) {
		title = truncate(title);
	}; 
	return title;
}

function truncate(title) {
	// truncates obscenely long titles at the last space before the 125th char
	const snip = title.slice(0,settings.titleLength);
	const finalSpace = snip.lastIndexOf(" ");
	return snip.slice(0,finalSpace) + "…";
}

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

PROPUBLICA_MEMBER_ENDPOINT = 'https://api.propublica.org/congress/v1/';
// legislator functionality
// depends on main.js

function displayLegislatorDetails(memberOfCongress) {
	clearContent();
	let m = memberOfCongress
	context = {				
		id: m.id,
		office: m.office,
		missed_votes: m.missed_votes_pct,
		name: m.first_name + ' ' + m.last_name,
		party: m.party,
		party_icon: settings.party_icon[m.party],
		phone: m.phone,
		state: m.state,
		title: m.short_title,
		url: m.url,
		votes_with_party_pct: m.votes_with_party_pct,		
	}
	PAGE_CACHE.currently_displayed = context.id;
	let source = $('#legislator_details_template').html();
	let template = Handlebars.compile(source);
	let html = template(context)
	$('.detail-view').html(html);
	generateMissedVoteChart(context.missed_votes);
	generatePartyLoyaltyChart(context.votes_with_party_pct);
	handleReturnToResults();
}

function displayLegislatorResults(matchingMembers) {		
	let resultCount = matchingMembers.length;
	let resultCountText = `${resultCount} ${pluralize(resultCount,'result')} found`;
	if (resultCount > 0) {		
		const results = matchingMembers.map((memberOfCongress) => renderLegislatorResults(memberOfCongress));
		$('.results').html(results);
	} else {
		// no results were found
		$('.results').html('')
		resultCountText = 'No results found';
	}
	$('.results').prepend(
		`
		<div class="results-count">
			${resultCountText}
		</div>
		`
	);
	
	// stores results page in variable so user can navigate back to it w/o making another external call
	let searchTerm = PAGE_CACHE.currentSearchTerm;
	if (!PAGE_CACHE.searchTermResults['l'][searchTerm]) {
		PAGE_CACHE.searchTermResults['l'][searchTerm] = matchingMembers;
	}
	// cache results in case same search term is used again
}

function displaySponsoredBills(sponsoredBillResults, maxResults, legislatorID) {
	// input: results of ProPublica json results for sponsored bills,
	// and max number of results desired to display (if not specified, max=20)
	if (sponsoredBillResults.results) {
		let sponsoredBills = sponsoredBillResults.results[0].bills;
		if (maxResults) {
			sponsoredBills = sponsoredBills.slice(0,maxResults);
		};
		let renderedResults = sponsoredBills.map((billObj) => renderSponsoredBillResults(billObj));	
		elementID = '.'	+ legislatorID
		$(elementID).find('.sponsored-bills-list').html(renderedResults);	
	}			
}

function getMemberListFromPropublica(chamber,callback) {	
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: PROPUBLICA_MEMBER_ENDPOINT + CURRENT_CONGRESS + '/' + chamber + '/members.json',
		datatype: 'jsonp',
		type: 'GET',
		success: callback,
	})
}

function getRecentBillsSponsoredByLegislator(legislatorID,callback) {
	// input: legislator ID, returns jsonObj
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: PROPUBLICA_MEMBER_ENDPOINT + 'members/' + legislatorID + '/bills/introduced.json',
		datatype: 'jsonp',
		type: 'GET',
		success: callback,
	})
}

function getSpecificRepLocal(id) {
	// checks cache to see if rep has been cached, and, if so, returns rep	
	if (PAGE_CACHE.members.by_id[id]) {		
		return PAGE_CACHE.members.by_id[id]
	};
	if (PAGE_CACHE.congress_populated) {
		// no quick cache found - searching populated congress list
		let congress = PAGE_CACHE.members.house.concat(PAGE_CACHE.members.senate);
		let match = congress.filter((member) => {return (member.id === id)})
		if (match.length > 0) {			
			PAGE_CACHE.members.by_id[id] = match[0];
			return match[0]
		}
	}
	// dang, no quick cache, no local search.
	return false;
}

function getSpecficRepPropublica(id, callback) {	
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: 'https://api.propublica.org/congress/v1/members/' + id + '.json',
		datatype: 'json',
		type: 'GET',
		success: (data) => {
			let member = data.results[0];
			let new_id = member.member_id;
			PAGE_CACHE.members.by_id[new_id] = member;
			let memberLocal = PAGE_CACHE.members.by_id[new_id]
			// propublica stores data in different locations, depending on how the data is retrieved, the following normalize the objects
			memberLocal.id = new_id;
			member.title = member.roles[0].title;
			member.state = member.roles[0].state;
			member.party = member.roles[0].party;
			member.short_title = member.roles[0].short_title;
			member.votes_with_party_pct = member.roles[0].votes_with_party_pct;
			member.missed_votes_pct = member.roles[0].missed_votes_pct;
			member.phone = member.roles[0].phone;
			member.office = member.roles[0].office;			
			callback(member);
		},
	})
} 

function displayVotePositions(positionData) {	
	let voteResults = positionData[0].votes.map(renderVotePositions);	
	$('.vote-positions-table').append(voteResults);
}

function getPositionIcon(position) {
	if (position === "Yes") {
		return `<i class="fa fa-thumbs-up" aria-hidden="true"></i> Yes`;
	} else if (position === "No") {
		return `<i class="fa fa-thumbs-down" aria-hidden="true"></i> No`;
	} else {
		return `<i class="fa fa-meh-o" aria-hidden="true"></i> ${position}`;
	}
}

function getPositionDataFromPropublica(id, callback) {	
	$.ajax({
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: 'https://api.propublica.org/congress/v1/members/' + id + '/votes.json',
		datatype: 'json',
		type: 'GET',
		success: callback,
	})
}

function handleGetVotePositionClick() {
	$('body').on('click','.get-recent-votes', function(e) {
		e.preventDefault();
		$('.get-recent-votes').toggle();
		$('.vote-positions').toggle();
		if ($('.vote-positions').is(':visible')) {
			let currentID = PAGE_CACHE.currently_displayed;
			if (PAGE_CACHE.members.by_id[currentID].vote_positions) {
				displayVotePositions(PAGE_CACHE.members.by_id[currentID].vote_positions);
			} else {
				getPositionDataFromPropublica(currentID,(data) => {
					PAGE_CACHE.members.by_id[currentID].vote_positions = data.results;
					displayVotePositions(data.results);
				})
			}	
		}		
	})
}

function handleRepClick() {
	$('body').on('click','.rep-request', function(e) {
		e.preventDefault();
		let id = $(this).attr('id');		
		let legislator = getSpecificRepLocal(id);
		if (legislator) {
			displayLegislatorDetails(legislator);
		} else {
			getSpecficRepPropublica(id,displayLegislatorDetails);
		};
	})
}

function handleShowRecentBillsClick() {
	$('body').on('click','.show-recent-bills', function(e) {
		e.preventDefault();			
		$('.show-recent-bills').toggle();
		$('.sponsored-bills-list').toggle();
		if ($('.sponsored-bills-list').is(':visible')) {			
			if (PAGE_CACHE.members.recent_bills[context.id]) {
			// populates legislator tile with recent bills. uses cached version if available.
				displaySponsoredBills(PAGE_CACHE.members.recent_bills[context.id],10,context.id);
			} else {
				getRecentBillsSponsoredByLegislator(context.id,(results) => {
					PAGE_CACHE.members.recent_bills[context.id] = results;
					displaySponsoredBills(results,10,context.id);
				})
			}	
		}		
	})
}

function populateCongressMemberInfo() {	
	// chains json requests to populate page_cache with propublica info about both houses
	PAGE_CACHE.congress_populating = true;
	// keeps track of whether API request has gone out and not yet returned
	getMemberListFromPropublica('house',data => {
		// first get house info, and if successful cache data and grab senate info		
		PAGE_CACHE.members['house'] = data.results[0].members;
		getMemberListFromPropublica('senate',data => {
			// grab senate info, cache, set flags indicating data has been cached
			PAGE_CACHE.members['senate'] = data.results[0].members;
			PAGE_CACHE.congress_populated = true;
			PAGE_CACHE.congress_populating = false;						
		})
	})
}

function renderLegislatorResults(memberOfCongress) {
	let m = memberOfCongress;
	const context = {		
		id: m.id,
		name: m.first_name + ' ' + m.last_name,
		office: m.office,
		party: m.party,
		party_icon: settings.party_icon[m.party],
		phone: m.phone,
		state: m.state,
		title: m.short_title,
		url: m.url,
	};
	let source = $('#legislator_result_template').html();
	let template = Handlebars.compile(source);
	let html = template(context);
	if (PAGE_CACHE.members.recent_bills[context.id]) {
		// populates legislator tile with recent bills. uses cached version if available.
		displaySponsoredBills(PAGE_CACHE.members.recent_bills[context.id],3,context.id);
	} else {
		getRecentBillsSponsoredByLegislator(context.id,(results) => {
			PAGE_CACHE.members.recent_bills[context.id] = results;
			displaySponsoredBills(results,3,context.id);
			PAGE_CACHE.results = $('.results').html();
			// caches page after results are in
		})
	}	
	return html;
}

function renderSponsoredBillResults(billObj) {
	context = {
		number: billObj.number,
		id: billObj.bill_id,
		title: renderTitle(billObj),
		dateField: relevantBillDateType(billObj),
		congress: billObj.congress,
		uri: billObj.bill_uri,
	};
	let cached_uri = context.id + '_uri';
	PAGE_CACHE[cached_uri] = context.uri;
	// uri cached to be retrieved on click
	return `
		<li><p><a href="#?type=b&id=${context.id}" id="${context.id}" class="bill-request">${context.title}</a></p>
			<p><strong>Congress:</strong> <span class="js-congress-num">${context.congress}</span></p>
			<p><strong>Bill number:</strong> ${context.number}<p>
			<p>${context.dateField}</p>
		</li>
	`
}

function renderVotePositions(vote) {	
	if (vote.description) {
		let bill_id = vote.bill.bill_id;		
		let position = getPositionIcon(vote.position);
		let question = vote.question;
		let result = vote.result;
		return `
		<tr>
			<td class="position-bill-name">${vote.description}</td>
			<td class="position-vote-question">${vote.question}</td>
			<td class="position-position">${position}</td>
			<td class="position-result">${vote.result}</td>
			<td class="position-vote-date"><time>${vote.date}</time></td>
		</tr>
		`
	} else {
		return '';
	};
}

function searchForCongressMember(searchTerm) {
	// returns array of congress member objects matching term
	// if congress member info is not available in cache, requests data from ProPublica
	if (PAGE_CACHE.congress_populated) {		
		let congress = PAGE_CACHE.members.house.concat(PAGE_CACHE.members.senate);		
		const matches = congress.filter(member => {			
			const fullName = (member.first_name + ' ' + member.last_name).toLowerCase();			
			return fullName.includes(searchTerm);
		});		
		displayLegislatorResults(matches);
	} else if (PAGE_CACHE.congress_populating) {			
		// patience, try again in 2s
		setTimeout(function(){
		searchForCongressMember(searchTerm);	
		},2000);
	} else {		
		// request congress dump from ProPublica, then search
		populateCongressMemberInfo(searchTerm);
		searchForCongressMember(searchTerm);
	}
}

const PROPUBLICA_API_KEY = 'eKsVN99hpB4wdCIFiDwTUxd1QRA45ACta0PWdxJo';
const MAPLIGHT_API_KEY = '01f384a9c18616b752063d174eda5fee';
const MAPLIGHT_BILL_POSITION_ENDPOINT = 'https://cors-anywhere.herokuapp.com/http://classic.maplight.org/services_open_api/map.bill_positions_v1.json';

const CURRENT_CONGRESS = 115;
const settings = {
	// settings for how data gets displayed
	titleLength: 125,
	splashDisplayed: 1,
	party_icon: {
		R: 'elephant',
		D: 'donkey',
		I: 'capitol',
	},
}

// core functionality - shared by bills.js and legislators.js
function clearContent() {
	// clears splash elements and removes any results or details currently displayed; used to transition to new page
	hideSplash();
	$('.results').html('')
	$('.detail-view').html('')
	showTopBarSearch();
}

function displaySplash() {
	// clears out all elements and displays the landing html
	settings.splashDisplayed = 1;
	$('nav').html('');
	$('.results').html('');
	$('.detail-view').html('');
	$('nav').prop('hidden',true)
	$('.splash-content').prop('hidden',false)	
	if (PAGE_CACHE.modal_open) {
		// hide modal if open
		$('.search-modal').toggleClass('hidden');
		$('.opensearch').html(`
			<i class="fa fa-search"></i>
		`)
		PAGE_CACHE.modal_open = false;
	}
	let splashContent = $('#splash-content-template').html()

	$('.splash-content').html(splashContent);
}

function getPropublicaDetails(url,callback) {	
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: url,
		datatype: 'json',
		type: 'GET',
		success: callback,
	})
}

function handleReturnToResults() {
	// invoked when user clicks "return" from a detail view page
	$('.back-to-results').click(e => {		
		e.preventDefault();		
		clearContent();
		$('.results').html(PAGE_CACHE.results);
	});
}

function handleSearch() {
	$('body').on('submit', '.search-form', e => {		
		e.preventDefault();		
		let searchTerm = $('.search-query').val();
		let searchType = $('.search-type').val();
		PAGE_CACHE.currentSearchTerm = searchTerm;
		// stores search term for recall & caching
		clearContent();
		$('.results').html('<p class="searching">Searching...</p>');
		if (searchType === "b") {			
			if (PAGE_CACHE.searchTermResults['b'][searchTerm]) {
				// checks to see if results are cached				
				displayBillResults(PAGE_CACHE.searchTermResults['b'][searchTerm]);
			} else {				
				getBillDataFromPropublica(searchTerm,displayBillResults);	
			}			
		} else {
			if (searchTerm != '') {
				searchForCongressMember(searchTerm.toLowerCase());	
			}			
		}
		$('.search-query').val('');
	})
}

function handleSearchTypeChange() {
	$('.splash-content, .search-modal').on('change','.search-type',() => {
		if ($('.search-type').val() === "b") {
			$('.search-query').attr('placeholder','Search for a bill...');
			if (settings.splashDisplayed) {
				$('.js-search-bill').prop('hidden',false);
				$('.js-search-rep').prop('hidden',true);
			};
		} else {
			$('.search-query').attr('placeholder','Search for a legislator...');
			if (settings.splashDisplayed) {
				$('.js-search-bill').prop('hidden',true);
				$('.js-search-rep').prop('hidden',false);
			};
		};			
	});
}

function toggleSearchModal() {
	$('.search-modal').toggleClass('hidden');
	if (PAGE_CACHE.modal_open) {
		$('.opensearch').html(`
			<i class="fa fa-search"></i>
		`)
		PAGE_CACHE.modal_open = false;
	} else {
		$('.opensearch').html(`
			<i class="fa fa-times"></i>
		`)
		PAGE_CACHE.modal_open = true;
		$('body').keydown(e => {
			// hide modal on escape press
			if (e.keyCode==27){
				toggleSearchModal()	
			}			
		})
		handleModalNav(0);
	}
}

function handleModalNav(page){
	if (page === 0) {
		$('.js-modal-back').hide();
		$('.search-type-select').show();
		$('.search-term-box').hide();		
		$('.js-modal-next').show();
		$('.js-modal-next').click(e => {
			e.stopPropagation();

			handleModalNav(1);
		})
	} else {
		$('.js-modal-back').show();
		$('.search-type-select').hide();
		$('.search-term-box').show();		
		$('.js-modal-next').hide();		
		$('.js-modal-back').click(e => {
			e.stopPropagation();
			handleModalNav(0);
		})
		$('.submit-button').click(function() {
			toggleSearchModal();
		})
	} 
}

function handleModalSearchClick() {
	// opens the search modal and changes the open/close icon
	$('body').on('click','.js-opensearch', e => {
		e.preventDefault;		
		toggleSearchModal();		
	})
}

function hideBrokenImages() {
	$('body').on('error','img',function() {
		alert("Image error")
	})
}
function hideSplash() {
	settings.splashDisplayed = 0;
	$('.splash-content').prop('hidden',true);
	$('.splash-content').html('');
}

function pluralize(count,word) {	
	return count === 1 ? word : (word + 's');
}

function showTopBarSearch() {
	$('nav').prop('hidden',false);
	let topBarSearch = $('#top-nav-template').html();
	$('nav').html(topBarSearch);
}

// mapLight organization functionality
function convertProPubBillTypeToMapLight(ppBillType) {
	// converts the bill type supplied by propublica to the 'prefix' used by maplight
	if (ppBillType === 'hr') {
		return 'h';
	} else if (ppBillType === 'hres') {
		return 'hr';	
	} else if (ppBillType === 'hjres') {
		return 'hj';
	} else if (ppBillType === 'sres') {
		return 'sr';
	} else if (ppBillType === 'sjres') {
		return 'sj'
	} else if (ppBillType === 's') {
		return 's'
	} else {
		return 'sc';
	}
}

function createMapLightCharts(billID) {
	// retrieves maplight data from cache; if not available, request data, process, cache, then create maps
	if (PAGE_CACHE.maplight[billID]) {		
		helperMapLightDataCharts(billID);
	} else {		
		getOrgPositionsOnBillfromMaplight(billID,(results) => {			
			let sectorResults = getSectors(results);			
			PAGE_CACHE.maplight[billID] = sectorResults;
			helperMapLightDataCharts(billID);
		});		
	};
}

function getOrgNamesandCounts(sectorObject) {
	// input: obj with org sector #s as keys and array of orgs by name
	// output: array of [array of sector names], [# of orgs in that sector]
	// doesn't count sectors with only one member
	let sectorNames = [];
	let sectorCounts = [];
	let keys = Object.keys(sectorObject)
	for (let key in keys) {
		// pushes count to sectorCounts, and sector name (if available) to sectorNames
		if (sectorObject[keys[key]].length > 1 && keys[key]) {
			sectorCounts.push(sectorObject[keys[key]].length);
			sectorNames.push(categoryCodes[keys[key]]);
			// categoryCodes is object created from OpenSecrets: https://www.opensecrets.org/downloads/crp/CRP_Categories.txt
		};		
	};
	return [sectorNames,sectorCounts]
}

function getOrgPositionsOnBillfromMaplight(billID,callback) {
	// takes propublica formatted bill_id, and returns json w/ 
	// list of organizations that have taken a position on a bill		
	let splitID = billID.split('-');
	let session = splitID[1];
	let prefixSplit = splitID[0].match(/[a-zA-Z]+|[0-9]+/g);
	let prefix = convertProPubBillTypeToMapLight(prefixSplit[0]);
	let number = prefixSplit[1];	
	query = {
		apikey: MAPLIGHT_API_KEY,
		jurisdiction: 'us',		
		number: number,
		prefix: prefix,
		session: session,			
	};
	$.getJSON(MAPLIGHT_BILL_POSITION_ENDPOINT,query,callback)
}

function getSectors(maplightBillJSON) {
	// takes in maplight json object, returns object
	// with support & oppose keys with values of objects 
	// with category codes as keys and array of org names as values
	const sectorCount = {
		support: {},
		oppose: {},
	};
	const organizations = maplightBillJSON.bill.organizations;	
	for (let org in organizations) {		
		if (organizations[org].disposition === "support") {
			if (sectorCount.support[organizations[org].catcode]) {
				sectorCount.support[organizations[org].catcode].push(organizations[org].name);
			} else {
				sectorCount.support[organizations[org].catcode] = [organizations[org].name];
				}
		} else {
			if (sectorCount.oppose[organizations[org].catcode]) {
				sectorCount.oppose[organizations[org].catcode].push(organizations[org].name);
			} else {
			sectorCount.oppose[organizations[org].catcode] = [organizations[org].name];
			}
		}
	}	
	return sectorCount;	
}

function helperMapLightDataCharts(billID) {
	// takes billID and creates charts
	// don't call this directly; use createMapLightCharts instead to ensure caching is used correctly
	let sectorOverview = PAGE_CACHE.maplight[billID]
	let supportCount = Object.keys(sectorOverview.support).length
	let opposeCount = Object.keys(sectorOverview.oppose).length
	let [sectorsSup,countsSup] = getOrgNamesandCounts(sectorOverview.support);	
	let [sectorsOp,countsOp] = getOrgNamesandCounts(sectorOverview.oppose);
	generateSectorSupOpChart([supportCount,opposeCount]);
	generateSectorBreakdownChart(sectorsSup,countsSup,"support");
	generateSectorBreakdownChart(sectorsOp,countsOp,"oppose");
}

// page handling
function pageHandler() {
	// runs listeners for page
	displaySplash();
	handleModalSearchClick();
	hideBrokenImages();	
	handleBillClick();	
	handleRepClick();
	handleSearch();
	handleSearchTypeChange();
	handleShowRecentBillsClick();
	handleGetVotePositionClick();
}

$(pageHandler())
