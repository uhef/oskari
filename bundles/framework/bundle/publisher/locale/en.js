Oskari.registerLocalization({
    "lang": "en",
    "key": "Publisher",
    "value": {
        "title": "Create map",
        "flyouttitle": "Create map",
        "desc": "",
        "published": {
            "title": "Your map has been created",
            "desc": "Embed the map by adding the HTML code below to your website."
        },
        "edit": {
            "popup": {
                "title": "Editing embedded map",
                "msg": "The map data of a previously embedded map is being updated"
            }
        },
        "BasicView": {
            "title": "Embed map",
            "titleEdit": "Edit embedded map",
            "domain": {
                "title": "Webpage where the map will be embedded",
                "label": "Website where the map will be embedded",
                "placeholder": "without the prefixes http or www",
                "tooltip": "Write the name of your website's index page, e.g. its domain name without the prefixes http or www, or the address of a subpage. Example: myhomepage.com"
            },
            "name": {
                "label": "The name of the map",
                "placeholder": "required",
                "tooltip": "Give your map a descriptive name. Please note the language of the user interface."
            },
            "language": {
                "label": "Language",
                "options": {
                    "fi": "Finnish",
                    "sv": "Swedish",
                    "en": "English"
                },
                "tooltip": "Select the language of the map interface and map data."
            },
            "size": {
                "label": "Size",
                "tooltip": "Select or define the size of the map to be embedded on your website. The map preview is displayed in the selected size."
            },
            "tools": {
                "label": "Tools",
                "tooltip": "Select the tools to be shown on the map. Their placement is displayed in the map preview.",
                "ScaleBarPlugin": "Scale line",
                "IndexMapPlugin": "Index map",
                "PanButtons": "Panning tool",
                "Portti2Zoombar": "Scale scrollbar",
                "ControlsPlugin": "Panning on",
                "SearchPlugin": "Address and place name search",
                "GetInfoPlugin": "Query tool for place data",
                "PublisherToolbarPlugin": "map tools",
                "selectDrawLayer" : "Select draw layer"
            },
            "toolbarToolNames": {
                "history_back": "Move backward",
                "history_forward": "Move forward",
                "measureline": "Measure distance",
                "measurearea": "Measure area",
                "point" : "Allow points",
                "line" : "Allow lines",
                "area" : "Allow areas",
            },
            "toollayout": {
                "label": "Tool layout",
                "tooltip": "Choose a layout for the tools shown on the map",
                "lefthanded": "Lefthanded",
                "righthanded": "Righthanded",
                "userlayout" : "Custom layout",
                "usereditmode": "Switch edit mode on",
                "usereditmodeoff": "Switch edit mode off"
            },
            "data": {
                "label":                "Statistics",
                "tooltip":              "Show the data related to map.",
                "grid":                 "Show statistic grid",
                "allowClassification":  "Allow classification"
            },
            "layout": {
                "label": "Layout",
                "fields": {
                    "colours": {
                        "label": "Colour scheme",
                        "placeholder": "Select colour scheme",
                        "buttonLabel": "Change",
                        "light_grey": "Light grey",
                        "dark_grey": "Dark grey",
                        "blue": "Blue",
                        "red": "Red",
                        "green": "Green",
                        "yellow": "Yellow",
                        "custom": "Custom colours",
                        "customLabels": {
                            "bgLabel": "Identifier background",
                            "titleLabel": "Identifier text",
                            "headerLabel": "Header text",
                            "iconLabel": "Icon",
                            "iconCloseLabel": "Dark",
                            "iconCloseWhiteLabel": "Light"
                        }
                    },
                    "fonts": {
                        "label": "Select font"
                    },
                    "toolStyles": {
                        "label": "Tool style",
                        "default": "Default style",
                        "rounded-dark": "Rounded (dark)",
                        "rounded-light": "Rounded (light)",
                        "sharp-dark": "Polygon (dark)",
                        "sharp-light": "Polygon (light)",
                        "3d-dark": "3D (dark)",
                        "3d-light": "3D (light)"
                    }
                },
                "popup": {
                    "title": "Select colour scheme",
                    "close": "Close",
                    "gfiDialog": {
                        "title": "Preview",
                        "featureName": "Preview",
                        "featureDesc": "The selected colour scheme only affects the colours of the feature info and layer selection popups"
                    }
                }
            },
            "layers": {
                "add": "Add layer",
                "label": "Map layers",
                "defaultLayer": "(Default layer)",
                "useAsDefaultLayer": "Use as default layer"
            },
            "myplaces": {
                "label": "My layers"
            },
            "sizes": {
                "small": "Small",
                "medium": "Medium",
                "large": "Large",
                "custom": "Custom size",
                "width": "width",
                "height": "height"
            },
            "buttons": {
                "save": "Save",
                "saveNew": "Save new",
                "ok": "OK",
                "replace": "Replace",
                "cancel": "Cancel",
                "add": "add map layer"
            },
            "confirm": {
                "replace": {
                    "title": "Do you wish to replace the embedded map?",
                    "msg": "Use replace to show changes on the embedded map without delay. It is not necessary to add the html-code to your webpage again."
                }
            },
            "layerselection": {
                "label": "Show map layers in menu",
                "info": "Select background maps. You can set the default background map in the map preview window.",
                "tooltip": "The background map is shown as the bottom layer of the map. When you select map layers to be used as the bottom layer, only one layer is visible at a time and you can switch between them. You can set the default background map in the map preview.",
                "promote": "Show aerial images?"
            },
            "preview": "Preview of the map to be embedded.",
            "location": "Location and zoom level",
            "zoomlevel": "Zoom level",
            "help": "Help",
            "error": {
                "title": "Error!",
                "size": "Error in size definitions",
                "domain": "Website is required information",
                "domainStart": "Omit prefixes http or www from the website name",
                "name": "Name is required information",
                "nohelp": "No help is available",
                "saveFailed": "Map publishing failed. Try again later.",
                "nameIllegalCharacters": "The name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens.",
                "domainIllegalCharacters": "The web site name contains disallowed characters. Allowed characters are the letters a-z as well as å, ä and ö, numbers, backspaces and hyphens."
            }
        },
        "NotLoggedView": {
            "text": "You need to log in before using the embedding function.",
            "signup": "Log in",
            "signupUrl": "/web/en/login",
            "register": "Register",
            "registerUrl": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
        },
        "StartView": {
            "text": "You can embed the map view you just created on your own or your employer's website.",
            "touLink": "Show Terms of use for Embedded maps",
            "layerlist_title": "Embeddable map layers",
            "layerlist_empty": "The map layers you selected cannot be embedded. The menu Selected map layers shows whether or not a map layer can be embedded.",
            "layerlist_denied": "Cannot be embedded",
            "denied_tooltip": "The providers of this map data have not granted permission to publish these materials on other websites. Check rights to publish in the menu Selected map layers before embedding.",
            "myPlacesDisclaimer": "NB. you are going to publish your own map layer.",
            "buttons": {
                "continue": "Continue",
                "continueAndAccept": "Accept Terms of use and continue",
                "cancel": "Cancel",
                "close": "Close"
            },
            "tou": {
                "notfound": "Can not find Terms of Use",
                "reject": "Reject",
                "accept": "Accept"
            }
        },
        "layer": {
            "show": "Show",
            "hide": "Hide",
            "hidden": "The map has been temporarily hidden.",
            "rights": {
                "can_be_published_map_user": {
                    "label": "Publication permitted",
                    "tooltip": "The map layer can be published in an embedded map window and the number of users per week may be limited."
                }
            }
        }
    }
});