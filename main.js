const PROPUBLICA_API_KEY = 'eKsVN99hpB4wdCIFiDwTUxd1QRA45ACta0PWdxJo'
const PROPUBLICA_ENDPOINT = 'https://api.propublica.org/congress/v1/bills/search.json'
const MAPLIGHT_API_KEY = '01f384a9c18616b752063d174eda5fee'
const settings = {
	// settings for how data gets displayed
	titleLength: 125,
	splashDisplayed: 1,
}

// bill functionality
function displayBill(bill){	
	clearContent();		
	let summary = getBillSummary(bill);
	let datefield = relevantBillDateType(bill);

	// handlebars context dic and calls below
	let context = {
		title: bill.title,
		date: datefield,
		sponsor_uri: bill.sponsor_uri,
		sponsor_title: bill.sponsor_title,
		sponsor: bill.sponsor_name,
		sponsor_part: bill.sponsor_party,
		sponsor_state: bill.sponsor_state,
		summary: summary,
	}

	let source = $('#bill_details_template').html();
	let template = Handlebars.compile(source);
	let html = template(context);

	$('.detail-view').html(html);

	handleReturnToResults();
	// retrieves results info from cache when 'return' link is clicked
}

function displayBillResults(data){
	clearContent();
	let resultCount = data.results[0].num_results;
	let resultCountText = `${resultCount} ${pluralize(resultCount,'result')} found`;
	if (resultCount > 0){		
		const results = data.results[0].bills.map((item) => renderBillResults(item));
		$('.results').html(results);
	} else {
		// no results were found
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
	if (!PAGE_CACHE.searchTermResults['b'].searchTerm) {
		PAGE_CACHE.searchTermResults['b'].searchTerm = data;
	}
	// cache results
}

function getBillDataFromPropublica(searchTerm,callback){	
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: PROPUBLICA_ENDPOINT,
		data: {
			query: searchTerm,
		},
		datatype: 'json',
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

function handleBillClick(){
	$('.results').on('click','.bill-request', function(e) {		
		e.preventDefault();
		let bill_id = $(this).attr('id');		
		displayBill(PAGE_CACHE[bill_id]);
	});
}

function renderBillResults(item){
	// returns html used to display bill results
	const title = renderTitle(item);	
	const context = {
		bill_uri: item.bill_uri,		
		datefield: relevantBillDateType(item),
		bill_id: item.bill_id,
		number: item.number, 
		sponsor_uri: item.sponsor_uri,
		sponsor: item.sponsor_name,
		sponsor_title: item.sponsor_title,
		sponsor_party: item.sponsor_party,
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

function renderTitle(billItem){
	// makes sure bill titles are reasonable length
	let title = billItem.short_title ? billItem.short_title : billItem.title;
	(title.length > settings.titleLength) ? truncate(title) : title;
	return title;
}

function truncate(title){
	// truncates obscenely long titles at the last space before the 125th char
	const snip = title.slice(0,settings.titleLength);
	const finalSpace = snip.lastIndexOf(" ");
	return snip.slice(0,finalSpace) + "…";
}

// legislator functionality
function handleRepSearch(searchTerm){
	console.log('handleRepSearch called');
	console.log('this feature not yet implemented');
}

function handleRepClick(url){
	$('.results').on('click','.rep-request', function(e) {
		e.preventDefault();
		let url = $(this).attr('href');
		getPropublicaDetails(url,displayRep);
	})
}

function displayRep(data){
	console.log('displayRep called');
	console.log(data);
	// debug -- remove!!
}

function getRepCIDFromPropublica(data){
	console.log('getRepCIDFromPropublica called -- Rep retrieved')
	console.log(data)
	// debug -- remove!!
	let cid = data.results[0].crp_id;
	console.log("CID is: " + cid);
	return cid;
}

// core functionality
function clearContent(){
	// clears splash elements and removes any results or details currently displayed; used to transition to new page
	hideSplash();
	$('.results').html('')
	$('.detail-view').html('')
	showTopBarSearch();
}

function displaySplash(){
	// clears out all elements and displays the landing html
	settings.splashDisplayed = 1;
	$('nav').html('');
	$('.results').html('');
	$('.detail-view').html('');
	$('nav').prop('hidden',true)
	$('.splash-content').prop('hidden',false)

	let splashContent = $('#splash-content-template').html()

	$('.splash-content').html(splashContent);
}

function getPropublicaDetails(url,callback){	
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: url,
		datatype: 'json',
		type: 'GET',
		success: callback,
	})
}

function handleReturnToResults(){
	$('.back-to-results-link').click(e => {
		e.preventDefault();
		clearContent();
		$('.results').html(PAGE_CACHE.results);
	});
}

function handleSearch(){
	$('body').on('submit', '.search-form', e => {		
		e.preventDefault();
		const searchTerm = $('.search-query').val();
		PAGE_CACHE.currentSearchTerm = searchTerm;
		// stores search term for cacheing
		if ($('.search-type').val() === "b"){
			if (PAGE_CACHE.searchTermResults['b'].searchTerm) {
				// checks to see if results are cached
				displayBillResults(PAGE_CACHE.searchTermResults['b'].searchTerm);
			} else {

				getBillDataFromPropublica(searchTerm,displayBillResults);	
			}			
		} else {
			handleRepSearch(searchTerm);
		}
	})
}

function handleSearchTypeChange(){
	$('.splash-content').on('change','.search-type',() => {
		if (settings.splashDisplayed) {
			if ($('.search-type').val() === "b") {
				$('.js-search-bill').prop('hidden',false);
				$('.js-search-rep').prop('hidden',true);
				$('.search-query').attr('placeholder','Search for a bill...');
			} else {
				$('.js-search-bill').prop('hidden',true);
				$('.js-search-rep').prop('hidden',false);
				$('.search-query').attr('placeholder','Search for a legislator...');
			};	
		};;		
	});
}

function hideSplash(){
	settings.splashDisplayed = 0;
	$('.splash-content').prop('hidden',true);
	$('.splash-content').html('');
}

function pluralize(count,word){	
	return count === 1 ? word : (word + 's');
}

function showTopBarSearch(){
	$('nav').prop('hidden',false);
	let topBarSearch = $('#top-nav-template').html();
	$('nav').html(topBarSearch);
}

// page handling
function pageHandler(){
	// runs listeners for page
	displaySplash();
	handleSearch();
	handleRepClick();
	handleBillClick();
	handleSearchTypeChange();
}

$(pageHandler())
