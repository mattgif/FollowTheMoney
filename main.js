// propublica congress API key
const PROPUBLICA_API_KEY = 'eKsVN99hpB4wdCIFiDwTUxd1QRA45ACta0PWdxJo'
const PROPUBLICA_ENDPOINT = 'https://api.propublica.org/congress/v1/bills/search.json'
// opensecrets API key
const OPENSECRETS_API_KEY = '4f65ef721d8386530390255880acbbb9'

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
	return `
		<div class="results-bill-tile">
			<h4 class='results-bill-title'><a href="${item.bill_uri}" class="bill-request">${title}</a></h4>
			<p>Bill number: ${item.number} | Introduced ${item.introduced_date}</p>
			<p>Subject: ${item.primary_subject}</p>
			<p>Sponsor: <a href="${item.sponsor_uri}" class="rep-request">${item.sponsor_title} ${item.sponsor_name} (<span class="affil-${item.sponsor_party}">${item.sponsor_party}</span>-${item.sponsor_state})</a></p>
		</div>
	`
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
	let snip = title.slice(0,settings.titleLength);
	let finalSpace = snip.lastIndexOf(" ");
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
		datefield = `Enacted: ${bill.enacted}`;
	} else {
		datefield = `Introduced: ${bill.introduced_date}`;
	}
	$('.detail-view').html(
		`	<div class="back-to-results">
				<a href="#" class="back-to-results-link">&lt; Back to results</a>
			</div>
			<div class="bill-title">
				<h1>${bill.title}</h1>
			</div>
			<div class="date">
				<p>${datefield}</p>
			</div>
			<div class="sponsor-tile">
				<h2>Sponsor:</h2>
				<p><a href="${bill.sponsor_uri}" class="rep-request">${bill.sponsor_title} ${bill.sponsor} (<span class="affil-${bill.sponsor_party}">${bill.sponsor_party}</span>-${bill.sponsor_state})</a></p>
				<div class="donors">
				</div>
			</div>
			<div class="bill-summary">
				<h3>Summary:</h3>
				<p>${summary}</p>
			</div>
		`	
	);
	handleReturnToResults();
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

function getRepDataFromOpenSecrets(cid){
	console.log('getRepDataFromOpenSecrets called');
	console.log('this feature not yet implemented');
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
	$('.splash-content').html(
		`
		<header role="banner">
			<h1 class="maintitle">Follow the Money</h1>
			<h2 class="subtitle">Trace the money behind legislation</h2>
		</header>

		<section class="primary search" role="search">
			<form action="#" class="search-form">
				<label for="search-type" class="search-type-label">I want to search for </label>
				<select class="search-type" name="search-type" id="search-type" aria-label="Choose what to search for">
					<option value="b" selected="selected">a bill</option>
					<option value="l">a legislator</option>
				</select>
				<label for="search-query" class="js-search-icon"><i class="fa fa-search" aria-hidden="true"></i></label>
				<input type="text" name="search-query" class="search-query" aria-label="search" placeholder="Search for a bill...">
				<button type="submit">Search</button>
			</form>
			<div class="instructions">
				<p class="js-search-bill">Enter a topic or bill name to start tracing the finances behind legislation.</p>
				<p class="js-search-rep" hidden>Search for a legislator to find their major donors, legislation they've sponsored, and their voting record.</p>
			</div>
		</section>
		`
	);
}

function hideSplash(){
	settings.splashDisplayed = 0;
	$('.splash-content').prop('hidden',true);
	$('.splash-content').html('');
}

function showTopBarSearch(){
	$('nav').prop('hidden',false);
	$('nav').html(
		`
		<h4 class="brand"><a href="#" onClick="displaySplash()">Follow the <i class="fa fa-money"></i></a></h4>
		<div class="nav search" role="search">
			<form action="#" class="nav search-form">
				<select class="nav search-type" name="search-type" id="search-type" aria-label="Choose what to search for">
					<option value="b" selected="selected" aria-label="search for a bill">Bill</option>
					<option value="l" aria-label="search for a legislator">Legislator</option>
				</select>				
				<input type="text" name="nav search-query" class="search-query" aria-label="search" placeholder="Search for a bill...">
				<button type="nav submit"><i class="fa fa-search" aria-hidden="true"></i></button>			
			</form>			
		</div>		
		`
	);
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
