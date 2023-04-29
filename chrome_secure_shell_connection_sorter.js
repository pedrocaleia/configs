(function() {
	let profileIds = nassh_.prefs_.get('profile-ids');
	profileIds = profileIds.slice(0);
	
	let freebalanceProfileHeader;
	let freebalanceProfiles = [];
	let personalProfileHeader;
	let personalProfiles = [];
	let otherProfileHeader;
	let otherProfiles = [];
	let separators = [];
	let finalProfiles = [];
	
	let sortFunction = function(object1, object2) {
		if(object1.description < object2.description) {
			return -1;
		}
		else if(object1.description > object2.description) {
			return 1;
		}
		else {
			return 0;
		}
	}
	
	for(profileId of profileIds) {
		let profile = nassh_.prefs_.getProfile(profileId);
		let description = profile.prefRecords_.description.currentValue;
		
		if(description == '.') {
			separators.push({profileId: profileId, profile: profile, description: description});
		}
		else if(description == '- - - - - - - - - - FreeBalance - - - - - - - - - -') {
			freebalanceProfileHeader = {profileId: profileId, profile: profile, description: description};
		}
		else if(description.endsWith('(F)')) {
			freebalanceProfiles.push({profileId: profileId, profile: profile, description: description});
		}
		else if(description == '- - - - - - - - - - Personal - - - - - - - - - -') {
			personalProfileHeader = {profileId: profileId, profile: profile, description: description};
		}
		else if(description.endsWith('(P)')) {
			personalProfiles.push({profileId: profileId, profile: profile, description: description});
		}
		else if(description == '- - - - - - - - - - Others - - - - - - - - - -') {
			otherProfileHeader = {profileId: profileId, profile: profile, description: description};
		}
		else {
			otherProfiles.push({profileId: profileId, profile: profile, description: description});
		}
	}
	
	if(freebalanceProfileHeader == undefined || personalProfileHeader == undefined || otherProfileHeader == undefined) {
		throw 'Some headers are missing';
	}
	else if(separators.length != 2) {
		throw 'There should be 2 separators';
	}
	
	// Sort all the arrays
	freebalanceProfiles.sort(sortFunction);
	personalProfiles.sort(sortFunction);
	otherProfiles.sort(sortFunction);
	
	finalProfiles.push(freebalanceProfileHeader.profileId);
	for(freebalanceProfile of freebalanceProfiles) {
		finalProfiles.push(freebalanceProfile.profileId);
	}
	finalProfiles.push(separators[0].profileId);
	
	finalProfiles.push(personalProfileHeader.profileId);
	for(personalProfile of personalProfiles) {
		finalProfiles.push(personalProfile.profileId);
	}
	finalProfiles.push(separators[1].profileId);
	
	finalProfiles.push(otherProfileHeader.profileId);
	for(otherProfile of otherProfiles) {
		finalProfiles.push(otherProfile.profileId);
	}
	
	/*for(finalProfile of finalProfiles) {
		console.log(finalProfile);
	}*/
	
	nassh_.prefs_.set('profile-ids', finalProfiles);
})();
