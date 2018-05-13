# polifluence
<img src="https://raw.githubusercontent.com/mattgif/polifluence/master/logo.png" alt="polifluence logo">

https://polifluence.netlify.com

Summary
-------

polifluence is a React / Redux / Node.js project that links legislation with campaign contributions. Search for a member of Congress to view their largest contributors by company or industry, or search for legislation to view its (co)sponsors and their contributors. polifluence combines data from ProPublica's congress and member APIs with OpenSecrets' contribution data.

#### Table of Contents
* [Screenshots](#screenshots)
* [API](#api)
* [Client](#client)
* [Technology used](#technology)

## Screenshots
| Landing  | Document review |
| ------------- | ------------- |
| <img src="https://raw.githubusercontent.com/mattgif/polifluence/master/screenshots/desktop_landing.PNG" alt="polifluence landing page" width="200"> | <img src="https://raw.githubusercontent.com/mattgif/polifluence/master/screenshots/desktop_member.PNG" alt="polifluence member details showing campaign contributions" width="200">  |

## API
### Repo link: https://github.com/mattgif/polifluence-api
polifluence's API is built with Node.js and is tested with mocha/chai

### Endpoints (GET)
#### api/members/
Returns all members of congress as json in the following form:
```
        firstName: # member's first name,
        lastName: # member's last name,
        shortTitle: # e.g. 'Sen.' or 'Rep.',
        chamber: # Senate or House,
        nextElection: # year member is next up for election,
        title: # e.g., 'Senator 1st class',
        party: # single letter representation of member's party (e.g., 'D', 'R', 'I'),
        state: # state (or state-like entity) member represents,
        crpId: # unique ID issued by Center for Responsive Politics,
        memberId: # unique ID used by ProPublica and others,
        website: # member's website,
        billsSponsored: # array of bill numbers of bills sponsored by member,
        billsCosponsored: # array of bill numbers of bills cosponsored by member,
        portrait: # link to member of congress's portrait, courtesy of https://theunitedstates.io/,
        topContributors: # list of top contributors by company,
        topIndustries: # list of top contributors by industry,
        lastUpdated: # the last time this object was refreshed. refreshed every 5 days, on request
```

#### api/members/:memberId
Returns member object for member with memberId.

#### api/members/:crpId/contributions
Returns contribution data for member with crpId.

#### api/members/:memberId/bills
Returns bills for member with memberId.

#### api/bills/recent
Returns array of bills in the following format:
```
        id: # unique bill id, formatted as bill number - dash - congress number, e.g. 'HR1-115',
        number: # bill number, e.g. 'HR1',
        title: # title of bill,
        shortTitle: # if available, a punchier title for the bill,
        sponsor: # memberId of sponsor,
        cosponsors: # array of memberIds of co sponsored,
        introducedDate: # date bill was introduced,
        enacted: # date bill was enacted,
        housePassage: # date bill passed house,
        senatePassage: # date bill passed senate,
        summary: # if available, a summary of bill,
        summaryShort: # if available, a punchier summary of the bill,
        subject: # if available, the primary subject of the bill
```

#### api/bills/search
Query in form ?term=[query]. Returns bills with titles/topics matching query.

#### api/bills/:id
Returns bill with billId

## Client
### Repo link: https://github.com/mattgif/polifluence-client
React / Redux front-end for searching data from the API. 


## Technology

### Back-end:
* [Node.js](https://nodejs.org/en/)
* [express](https://expressjs.com/)
* MongoDB / mongoose 
* [Mocha](https://mochajs.org/)

### Front-end:
* Javascript/html/css
* [React](https://reactjs.org/)
* [Redux](https://github.com/reactjs/react-redux)

APIs
----
* [ProPublica](https://projects.propublica.org/api-docs/congress-api/)
* [OpenSecrets](https://www.opensecrets.org)
