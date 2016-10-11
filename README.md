# ucsd-ansible-tower

----------

## Scripts to Integrate UCSD Provisioning workflows with Ansible Tower

Validated on Ansible Tower 3.0 with Ansible 2.1.

Instructions for Installing Ansible Tower available [here](http://docs.ansible.com/ansible-tower/latest/html/installandreference/index.html).

In order to work, you must first create one or more Ansible Playbooks and one or more Ansible Inventories.  These specific UCSD Custom Tasks are designed to update **existing** inventories, not create new Inventories or create new Ansible Playbooks.  

We will assume that you have already created an Ansible Inventory and associated it with one or more Ansible Playbooks.  If you require guidance on how to do that, read [Intro to Playbooks](http://http://docs.ansible.com/ansible/playbooks_intro.html).

It is also necessary to create a custom **Credential Policy** to authenticate to Ansible Tower.  Use the *IPMI* option and enter the IP address, login and password for Ansible Tower.  Each of the workflow tasks includes code for a Before Marshall script (SelectCredentials.js) that is included as part of the custom workflow task.

Two UCSD Custom Tasks are included.  The first adds a newly created VM to a specified Ansible Inventory.  This task can be run multiple times if you need to add the VM to multiple inventories.  The determination of which inventory to add the VM can be user specified or programatically within the workflow.

The second task simply triggers an Ansible Run - which will then pick up the newly added VM in the inventory and perform the prescribed software update per the Playbook instructions.  Triggering the Ansible Run is not required - generally the Ansible system is setup to do this inventory update on a regular basis anyway.  But for those who do not want to have to wait until the next scheduled update, this task will trigger an immediate update.

We leverage Ansible Tower because of the great RESTful API it provides.  

The code segments *Register Host Custom Task* and *Start Ansible Run Custom Task* need to be added as Custom Workflow Tasks inside UCS Director.  The simpliest way to do this would be to import the included Workflow Export **Ansible_Tower_05Oct2016.wfdx**.  Follow instructions for importing a workflow are available [here](http://www.cisco.com/c/en/us/td/docs/unified_computing/ucs/ucs-director/orchestration-guide/6-0/b_UCS_Director_Orchestration_Guide_6_0/b_UCS_Director_Orchestration_Guide_6_0_chapter_0111.html#concept_4B5264081F1B4C35ACB48579DC347BBE).



