/**
 * @description : PT.UI.Tabs
 * @filename    : pastry.ui.tabs.js
 * @requires    : [pastry.js, pastry.ui.js]
 */
'use strict';

(function (PT) {
    if (PT.NODEJS) {
        return;
    }
    PT.UI.Tabs = function ($tabsMenu, option) {
        option = option || {};
        var currentTab   = 'data-currentTab',
            contentIds   = 'data-contentIds',
            activeClass  = option.activeClass || 'PT-activeTab',
            showContents = function ($tab) {
                $tab.getAttribute(contentIds).split(/\s/).each(function (id) {
                    PT.UI.show(PT.DOC.getElementById(id));
                });
            },
            hideContents = function ($tab) {
                $tab.getAttribute(contentIds).split(/\s/).each(function (id) {
                    PT.UI.hide(PT.DOC.getElementById(id));
                });
            };

        $tabsMenu.children.each(function ($child) {
            if (PT.isObj($child)) {
                var currentTabId = $tabsMenu.getAttribute(currentTab);
                if ($child.id === currentTabId) {
                    PT.UI.addClass($child, activeClass);
                    showContents($child);
                } else {
                    hideContents($child);
                }
                $child.addEventListener('click', function(){
                    var $oldTab = PT.DOC.getElementById($tabsMenu.getAttribute(currentTab)),
                        $newTab = this;
                    PT.UI.removeClass($oldTab, activeClass);
                    hideContents($oldTab);
                    PT.UI.addClass($newTab, activeClass);
                    showContents($newTab);
                    $tabsMenu.setAttribute(currentTab, $newTab.id);
                });
            }
        });
    };
 }(PT));
