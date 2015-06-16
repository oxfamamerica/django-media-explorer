angular.module('mediaExplorer').service('ActiveTab', function ActiveTab(){
	
	var ActiveTab = this;
	ActiveTab.activeTab = 1;

	ActiveTab.changeActiveTab = function(tabNumber){
		ActiveTab.activeTab = tabNumber;
	}

	return ActiveTab;
});