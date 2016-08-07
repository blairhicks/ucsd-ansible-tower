/**
 * Before Marshall script to query user for Ansible Account information
 */

importPackage(com.cloupia.feature.accounts);
importPackage(java.lang);
importPackage(java.util);
importPackage(com.cloupia.fw.objstore);
importPackage(com.cloupia.model.cIM);
importPackage(com.cloupia.lib.connector.account);
importPackage(com.cloupia.lib.connector.account.credential);



function getCredentialPolicies(){
	var creds = PersistenceUtil.getAllCredentialPolicies()
	var pairs = new Array();
	for(i=0;i<creds.size();i++){
		pairs[i] = new FormLOVPair(creds.get(i).name,creds.get(i).name);//lov labels and values
	}
	return pairs;
}


var credentialsListLOV = getCredentialPolicies();
page.setEmbeddedLOVs(id + ".AnsibleTowerAccount", credentialsListLOV);
