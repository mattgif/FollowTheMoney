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
		phone: m.phone,
		state: m.state,
		title: m.short_title,
		url: m.url,
		votes_with_party_pct: m.votes_with_party_pct,		
	}
	let source = $('#legislator_details_template').html();
	let template = Handlebars.compile(source);
	let html = template(context)
	$('.detail-view').html(html);
	generateMissedVoteChart(context.missed_votes);
	generatePartyLoyaltyChart(context.votes_with_party_pct);

	if (PAGE_CACHE.members.recent_bills[context.id]) {
		// populates legislator tile with recent bills. uses cached version if available.
		displaySponsoredBills(PAGE_CACHE.members.recent_bills[context.id],10,context.id);
	} else {
		getRecentBillsSponsoredByLegislator(context.id,(results) => {
			PAGE_CACHE.members.recent_bills[context.id] = results;
			displaySponsoredBills(results,10,context.id);
		})
	}

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
	let sponsoredBills = sponsoredBillResults.results[0].bills;
	if (maxResults) {
		sponsoredBills = sponsoredBills.slice(0,maxResults);
	};
	let renderedResults = sponsoredBills.map((billObj) => renderSponsoredBillResults(billObj));	
	elementID = '.'	+ legislatorID
	$(elementID).find('.sponsored-bills-list').html(renderedResults);
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
			<p>Congress: <span class="js-congress-num">${context.congress}</span> | Bill number: ${context.number} | ${context.dateField} </p>
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