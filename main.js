// propublica congress API key
const PROPUBLICA_API_KEY = 'eKsVN99hpB4wdCIFiDwTUxd1QRA45ACta0PWdxJo'
const PROPUBLICA_ENDPOINT = 'https://api.propublica.org/congress/v1/bills/search.json'
// opensecrets API key
const OPENSECRETS_API_KEY = '4f65ef721d8386530390255880acbbb9'

const settings = {
	// settings for how data gets displayed
	titleLength: 125,
}

function handleSearch(){
	$('.search-form').submit(e => {		
		e.preventDefault();
		const searchTerm = $('.search-query').val();
		console.log('this: ');
		console.log(this);
		if ($('.search-type').val() === "b"){
			getDataFromPropublica(searchTerm,displayBillResults);
		} else {
			handleRepSearch(searchTerm);
		}
	})
}

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

function handleRepSearch(searchTerm){
	console.log('handleRepSearch called');
}

function renderBillResults(item){
	// returns html used to display bill results
	const title = renderTitle(item);	
	return `
		<div class="results-bill-tile">
			<h4 class='results-bill-title'>${title}</h4>
			<p>Bill number: ${item.number} | Introduced ${item.introduced_date}</p>
			<p>Subject: ${item.primary_subject}</p>
			<p>Sponsor: ${item.sponsor_title} ${item.sponsor_name} (<span class="affil-${item.sponsor_party}">${item.sponsor_party}</span>-${item.sponsor_state})</p>
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
	console.log(data);	
	// debug - remove logging from final!
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

function handleSearchTypeChange(){
	$('.search-type').change(() => {
		if ($('.search-type').val() === "b") {
			$('.js-search-bill').prop('hidden',false);
			$('.js-search-rep').prop('hidden',true);
		} else {
			$('.js-search-bill').prop('hidden',true);
			$('.js-search-rep').prop('hidden',false);
		};
	});
}

function displaySplash(){
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

function hideMainSearchElement(){
	$('.primary.search').prop('hideen',true);

}

function showTopBarSearch(){
	$('nav').prop('hidden',false);
	$('nav').html(
		`
		<h4 class="brand"><a href="#">Follow the <i class="fa fa-money"></i></a></h4>
		<div class="nav search" role="search" hidden>
			<form action="#" class="nav search-form">
				<select class="nav search-type" name="search-type" id="search-type" aria-label="Choose what to search for">
					<option value="b" selected="selected" aria-label="search for a bill"><i class="fa fa-file-text" aria-hidden="true"></i></option>
					<option value="l" aria-label="search for a legislator"><i class="fa fa-users" aria-hidden="true"></i></option>
				</select>				
				<input type="text" name="nav search-query" class="search-query" aria-label="search" placeholder="Search for a bill...">
				<button type="nav submit"><i class="fa fa-search" aria-hidden="true"></i></button>			
			</form>			
		</div>		
		`
	);
}

function pageHandler(){
	// runs listeners for page
	displaySplash();
	handleSearch();
	handleSearchTypeChange();
}

$(pageHandler())
