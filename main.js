const PROPUBLICA_API_KEY = 'eKsVN99hpB4wdCIFiDwTUxd1QRA45ACta0PWdxJo'
const PROPUBLICA_ENDPOINT = 'https://api.propublica.org/congress/v1/bills/search.json'
const MAPLIGHT_API_KEY = '01f384a9c18616b752063d174eda5fee'
const settings = {
	// settings for how data gets displayed
	titleLength: 125,
	splashDisplayed: 1,
}

// bill functionality
function getDataFromPropublica(searchTerm,callback){	
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

function renderBillResults(item){
	// returns html used to display bill results
	const title = renderTitle(item);	
	const context = {
		bill_uri: item.bill_uri, 
		title: title, 
		number: item.number, 
		introduced_date: item.introduced_date, 
		subject: item.primary_subject,
		sponsor_uri: item.sponsor_uri,
		sponsor: item.sponsor_name,
		sponsor_title: item.sponsor_title,
		sponsor_party: item.sponsor_party,
		state: item.sponsor_state,
	}
	let source = $('#bill_result_template').html();
	let template = Handlebars.compile(source);
	let html = template(context);
	return html
}

function renderTitle(item){
	// makes sure bill titles are reasonable length
	let title = null;	
	if (item.short_title){
		// checks to see if short title is available, and uses that if it is
		title = item.short_title;
	} else {
		title = item.title;
	}
	if (title.length > settings.titleLength) {
		title = truncate(title);
	}
	return title;
}

function truncate(title){
	// truncates obscenely long titles at the last space before the 125th char
	const snip = title.slice(0,settings.titleLength);
	const finalSpace = snip.lastIndexOf(" ");
	return snip.slice(0,finalSpace) + "…";
}

function displayBillResults(data){
	clearContent();
	let resultCount = data.results[0].num_results;
	let resultCountText = `${resultCount} results found`;
	if (resultCount > 0){		
		if (resultCount === 1){
			// pluralization 
			resultCountText = `${resultCount} result found`;
		}
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
}

function handleBillClick(){
	$('.results').on('click','.bill-request', function(e) {		
		e.preventDefault();
		PAGE_CACHE.results = $('.results').html();
		// stores results page in variable so user can navigate back to it w/o making another external call
		let url = $(this).attr('href');
		if (PAGE_CACHE.billData && PAGE_CACHE.billData.results[0].bill_uri === url){
			// checks to see if bill data is cached, and if so retrieves cached version
			console.log('Cached version found!')
			// debug -- remove!!
			displayBill(PAGE_CACHE.billData);
		} else {
			getPropublicaDetails(url,displayBill);	
		}		
	});
}

function displayBill(data){
	PAGE_CACHE.billData = data;
	// caches data to save on ajax calls
	console.log(data);
	// debug -- remove!	

	clearContent();	
	const bill = data.results[0];
	let summary = null;
	let datefield = null;
	if (bill.summary_short) {
		// apparently not all bills have summaries. there should be a law or something!
		summary = bill.summary_short;
	} else if (bill.summary) {
		summary = bill.summary;
	} else {
		summary = 'No summary available.'
	}
	if (bill.enacted){
		// Selects most salient date format
		datefield = `Enacted: ${bill.enacted}`;
	} else {
		datefield = `Introduced: ${bill.introduced_date}`;
	}

	// handlebars context dic and calls below
	let context = {
		title: bill.title,
		date: datefield,
		sponsor_uri: bill.sponsor_uri,
		sponsor_title: bill.sponsor_title,
		sponsor: bill.sponsor,
		sponsor_part: bill.sponsor_party,
		sponsor_state: bill.sponsor_state,
		summary: summary,
	}

	let source = $('#bill_details_template').html();
	let template = Handlebars.compile(source);
	let html = template(context);

	$('.detail-view').html(html);

	handleReturnToResults();
	// retrieves results info from cache
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
function handleReturnToResults(){
	$('.back-to-results-link').click(e => {
		e.preventDefault();
		clearContent();
		$('.results').html(PAGE_CACHE.results);
	});
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

function handleSearch(){
	$('body').on('submit', '.search-form', e => {		
		e.preventDefault();
		const searchTerm = $('.search-query').val();
		if ($('.search-type').val() === "b"){
			getDataFromPropublica(searchTerm,displayBillResults);
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

function hideSplash(){
	settings.splashDisplayed = 0;
	$('.splash-content').prop('hidden',true);
	$('.splash-content').html('');
}

function showTopBarSearch(){
	$('nav').prop('hidden',false);
	let topBarSearch = $('#top-nav-template').html();
	$('nav').html(topBarSearch);
}

function clearContent(){
	hideSplash();
	$('.results').html('')
	$('.detail-view').html('')
	showTopBarSearch();
}

function pageHandler(){
	// runs listeners for page
	displaySplash();
	handleSearch();
	handleRepClick();
	handleBillClick();
	handleSearchTypeChange();
}

$(pageHandler())
