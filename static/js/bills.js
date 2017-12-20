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