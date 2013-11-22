/**
 * @description : PT.UI.Tabs
 * @filename    : pastry.ui.tabs.js
 * @requires    : [pastry.js, pastry.dom.js, pastry.dom.classlist.js, pastry.css.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }

    /**
     * @description : bind tabs behavior to an element with childs.
     * @param       : {HTMLElement} $tabs, tabs menu.
     * @param       : {Object     } option, options for binding tabs.
     * @syntax      : PT.UI.Tabs($tabs[, option])
     */
    PT.UI = PT.UI || {};
    PT.UI.Tabs = function ($tabsMenu, option) {
        option = option || {};
        var currentTab   = 'current',
            contentIds   = 'ids',
            activeClass  = option.activeClass || 'PT-activeTab',
            showContents = function ($tab) {
                $tab.dataset[contentIds].split(/\s/).each(function (id) {
                    PT.DOC.getElementById(id).show();
                });
            },
            hideContents = function ($tab) {
                $tab.dataset[contentIds].split(/\s/).each(function (id) {
                    PT.DOC.getElementById(id).hide();
                });
            };

        $tabsMenu.children.each(function ($child) {
            if (PT.isObj($child)) {
                var currentTabId = $tabsMenu.dataset[currentTab];
                if ($child.id === currentTabId) {
                    $child.classList.add(activeClass);
                    showContents($child);
                } else {
                    hideContents($child);
                }
                $child.addEventListener('click', function(){
                    var $oldTab = PT.DOC.getElementById($tabsMenu.dataset[currentTab]),
                        $newTab = this;
                    $oldTab.classList.toggle(activeClass);
                    $newTab.classList.toggle(activeClass);
                    hideContents($oldTab);
                    showContents($newTab);
                    $tabsMenu.dataset[currentTab] = $newTab.id;
                });
            }
        });
    };
 }(PT));
