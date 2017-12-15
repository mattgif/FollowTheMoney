const PROPUBLICA_API_KEY = 'eKsVN99hpB4wdCIFiDwTUxd1QRA45ACta0PWdxJo';
const MAPLIGHT_API_KEY = '01f384a9c18616b752063d174eda5fee';
const MAPLIGHT_BILL_POSITION_ENDPOINT = 'https://cors-anywhere.herokuapp.com/http://classic.maplight.org/services_open_api/map.bill_positions_v1.json';

const CURRENT_CONGRESS = 115;
const settings = {
	// settings for how data gets displayed
	titleLength: 125,
	splashDisplayed: 1,
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
	$('.back-to-results-link').click(e => {		
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
			searchForCongressMember(searchTerm.toLowerCase());
		}
		$('.search-query').val('');
	})
}

function handleSearchTypeChange() {
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
		console.log('modalSearchClicked')
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

// page handling
function pageHandler() {
	// runs listeners for page
	displaySplash();
	handleModalSearchClick();
	hideBrokenImages();
	handleSearch();
	handleRepClick();
	handleBillClick();
	handleSearchTypeChange();
}

$(pageHandler())
