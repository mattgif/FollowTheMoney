const PROPUBLICA_MEMBER_ENDPOINT = 'https://api.propublica.org/congress/v1/';

// legislator functionality
// depends on main.js

function displayLegislatorResults(matchingMembers) {	
	console.log(matchingMembers)
	// debug -- remove!!	
	let resultCount = matchingMembers.length;
	let resultCountText = `${resultCount} ${pluralize(resultCount,'result')} found`;
	if (resultCount > 0) {		
		const results = matchingMembers.map((memberOfCongress) => renderLegislatorResults(memberOfCongress));
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
	if (!PAGE_CACHE.searchTermResults['l'][searchTerm]) {
		PAGE_CACHE.searchTermResults['l'][searchTerm] = matchingMembers;
	}
	// cache results in case same search term is used again


}

function displayRep(data) {
	console.log('displayRep called');
	console.log(data);
	// debug -- remove!!
}

function displaySponsoredBills(sponsoredBillResults, maxResults, legislatorID) {
	// input: results of ProPublica json results for sponsored bills,
	// and max number of results desired to display (if not specified, max=20)
	console.log('sponsored bills found for', legislatorID,sponsoredBillResults)
	let sponsoredBills = sponsoredBillResults.results[0].bills;
	if (maxResults) {
		sponsoredBills = sponsoredBills.slice(0,maxResults);
	};
	let renderedResults = sponsoredBills.map((billObj) => renderSponsoredBillResults(billObj));	
	elementID = '.'	+ legislatorID
	console.log('elementID:',elementID)	
	console.log('appending to', $(elementID))
	$(elementID).find('.sponsored-bills-list').html(renderedResults);
}

function renderSponsoredBillResults(billObj) {
	context = {
		number: billObj.number,
		id: billObj.bill_id,
		title: renderTitle(billObj),
		dateField: relevantBillDateType(billObj),
		congress: billObj.congress,
		uri: billObj.uri,
	};
	let cached_uri = context.id + '_uri';
	PAGE_CACHE[context.id] = context.uri;
	// uri cached to be retrieved on click
	return `
		<li><p><a href="#?${id}" id="${id}" class="bill-request">${title}</a></p>
			<p>Congress: <span class="js-congress-num">{{congress}}</span> | Bill number: ${number} | ${dateField} </p>
		</li>
	`
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
	console.log('getting recent bills');
	// debug -- remove!!
	$.ajax({		
		headers: {'X-API-Key': PROPUBLICA_API_KEY},
		// ProPub requires key in header
		url: PROPUBLICA_MEMBER_ENDPOINT + 'members/' + legislatorID + '/bills/introduced.json',
		datatype: 'jsonp',
		type: 'GET',
		success: callback,
	})
}

function handleRepClick(url) {
	$('.results').on('click','.rep-request', function(e) {
		e.preventDefault();
		let url = $(this).attr('href');
		getPropublicaDetails(url,displayRep);
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
		party: m.party,
		state: m.state,
		title: m.short_title,
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
		})
	}	
	return html;
}

function searchForCongressMember(searchTerm) {
	// returns array of congress member objects matching term
	// if congress member info is not available in cache, requests data from ProPublica
	if (PAGE_CACHE.congress_populated) {		
		let congress = PAGE_CACHE.members.house.concat(PAGE_CACHE.members.senate);		
		const matches = congress.filter(member => {			
			const fullName = (member.first_name + ' ' + member.last_name).toLowerCase();
			// console.log(`${fullName} includes ${searchTerm}:`,fullName.includes(searchTerm));
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