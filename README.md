# ucsd-ansible-tower
Scripts to Integrate UCSD Provisioning workflows with Ansible Tower

Validated on Ansible Tower 3.0 with Ansible 2.1.

Instructions for Installing Ansible Tower available [here](http://docs.ansible.com/ansible-tower/latest/html/installandreference/index.html).

The code segments *Register Host Custom Task* and *Start Ansible Run Custom Task* need to be added as Custom Workflow Tasks inside UCS Director.  The simpliest way to do this would be to import the included Workflow Export **Ansible_Tower_05Oct2016.wfdx**.  Follow instructions for importing a workflow are available [here](http://www.cisco.com/c/en/us/td/docs/unified_computing/ucs/ucs-director/orchestration-guide/6-0/b_UCS_Director_Orchestration_Guide_6_0/b_UCS_Director_Orchestration_Guide_6_0_chapter_0111.html#concept_4B5264081F1B4C35ACB48579DC347BBE).



