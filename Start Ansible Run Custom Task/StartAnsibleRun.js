//----------------------------------------------------------------------------------------
//
// Author: Blair Hicks (blahicks@cisco.com)
//
// Workflow Task Name: Ansible Tower Run Job
//
// Version: 1.0
//
// Description:
//	This custom task leverages the Ansible Tower API to initiate a new run of a job_template.
//
// Based on Kevin Chua's Satellite Custom Tasks (https://communities.cisco.com/docs/DOC-61025)
//
//
// Inputs:
//	AnsibleTowerServer: Ansible Tower Server
//	AnsibleTowerTransport: http or https to access the Tower API
//	AnsibleTowerAccount: Credential Policy name for the Tower API Access
//          AnsibleTowerJobTemplate: Specify Job Template to run
//  
//
// Outputs:
//	strResult: Host Identifier
//
//----------------------------------------------------------------------------------------

importPackage(java.io);
importPackage(org.apache.http);
importPackage(org.apache.http.client);
importPackage(org.apache.http.client.methods);
importPackage(org.apache.http.impl.client);
importPackage(java.lang);
importPackage(java.util);
importPackage(com.cloupia.model.cIM);
importPackage(com.cloupia.service.cIM.inframgr);
importPackage(org.apache.http.entity);
importPackage(com.cloupia.lib.connector.account);
importPackage(com.cloupia.lib.connector.account.credential);


//----------------------------------------------------------------------------------------
//                                 ### FUNCTIONS ###
//----------------------------------------------------------------------------------------

//Get the Credentials from the Credentials policy.
function getAccount(accountName) {	
	logger.addInfo("Looking for the following account: " + accountName); 
	var account = PersistenceUtil.getCredentialPolicyByName(accountName);
	if (account != null) {
		logger.addInfo("Account: " + accountName + " found."); 
		return account;
	} else {
		logger.addError("Account: " + accountName + " NOT found."); 
		ctxt.setFailed("No Account found with name: " + accountName);
	}		
}


function WebServiceAccess() {
	var httpClient = new DefaultHttpClient();
	var inputMethod = "POST";
	var getRequest;
	var postRequest;
	var response;
	var br;
	var buffer;
	var payloadData;
	var requestSuccess;
	var outLine;

	var transport = String(input.AnsibleTowerTransport);

	// get username and password based on the Credential Policy
	var TowerAccount = getAccount(String(input.AnsibleTowerAccount));
	var TowerUserPass = TowerAccount.getUserName()+":"+TowerAccount.getPassword();

	// Base64 encode username:password to create the authorization string
	var TowerAuthorization = Base64.encode(TowerUserPass);
	var TowerAuthString = "Basic "+TowerAuthorization;

	var towerFQDN = String(input.AnsibleTowerServer);
	var jobTemp = String(input.AnsibleTowerJobTemplate);
	var strURL = transport+"://"+towerFQDN+"/api/v1/job_templates/"+jobTemp+"/launch/";
	var authorizationHeader = TowerAuthString;

	// Create JSON Payload
	var map = new HashMap();
	map.put("job_explanation", "Launched by UCSD");
    
	var payload = JSON.javaToJsonString(map, map.getClass());
 
	logger.addInfo("input URL : " + strURL + " Authorization header : " + authorizationHeader);
	logger.addInfo("PAYLOAD: " +payload);

	try {
		postRequest = new HttpPost(strURL);
		postRequest.addHeader("Authorization", authorizationHeader);
		postRequest.addHeader("Content-Type", "application/json");
		payloadData = new StringEntity(payload);
		postRequest.setEntity(payloadData); 
	            response = httpClient.execute(postRequest); 

		if (response.getStatusLine().getStatusCode() != 202) {
			logger.addError("Failed : HTTP error code: " + response.getStatusLine().getStatusCode());
		}

		br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
                   
		buffer = new StringBuffer();
//		logger.addInfo("Output from Server .... \n");
		while ((outLine = br.readLine()) != null) {
			buffer.append(outLine);
		}

//		logger.addInfo("get response " + buffer.toString());
		var responseString = buffer.toString();
           

		requestSuccess = true; 
		httpClient.getConnectionManager().shutdown();                    
	} 
	catch (e) {  
		ctxt.setFailed("web service request failed : " + e.message);
	} //try
} //Function

//
// main();
//


var Base64 = {

    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
}


WebServiceAccess();
