/**
 * dhtmlXTree management (add, remove, move item definition)
 *
 * @param name
 * @param urlJsonRPC
 * @param divGuid
 * @param firstItemString
 * @param selectedItem
 * @param selectOptions
 * @param params
 * @param observer
 * @constructor
 */
function UIAjaxSelectRenderer(name, urlJsonRPC, divGuid, firstItemString, selectedItem, selectOptions, params, observer)
{
	if (!$(divGuid))
		return ;

    this.name = name;
    this.urlJsonRPC = urlJsonRPC;
    this.divGuid = divGuid;
    this.firstItemString = firstItemString;
    this.selectedItem = selectedItem;
    this.selectOptions = selectOptions;
    this.params = params.evalJSON();
    this.observer = observer;
    this.optionsHTML = '';
    this.selectHTML = '';
    this.ajaxData = "";

    // Call urlJsonRPC and create all options with result
    var param = {};

    this.init = function ()
    {
        this.getAjaxData();
    }

    /**
     * Get all needed data in Ajax
     */
    this.getAjaxData = function ()
    {
        var ajaxRpc = new Ajax.Request(
            this.urlJsonRPC, {
                method    : 'get',
                parameters: this.params,
                onSuccess : function (response)
                {
                    this.ajaxData = response.responseJSON;
                    this.updateOptions();

                    // Check if an observer is given
                    if(0 !== this.observer.length)
                    {
                        //if element to be observed isset attach onChangeFunction to it's onChange event
                        Event.observe(this.observer, 'change', this.onChangeFunction);
                    }

                }.bind(this)
            }
        );
    }

    this.onChangeFunction = function()
    {
        this.optionsHTML = '';
        this.params[this.observer] = $(this.observer).getValue();
        this.getAjaxData();
    }.bind(this);

    /**
     * Update fully the select
     */
    this.updateOptions = function()
    {
        this.selectHTML = '<select ' + this.selectOptions + ' name="' + this.name + '" id="' + this.name + '">';

        if (this.firstItemString != '')
            this.selectHTML += '<option value="">' + this.firstItemString + '</option>';

        // Build all this.ajaxData
        this.ajaxData.each(function(option)
        {
            this.getBranchOptions(option, 0);
        }.bind(this));

        this.selectHTML += this.optionsHTML + '</select>';

        // Replace select
        var div = $(this.divGuid);
		if (div)
		{
			div.innerHTML = '';
			div.insert(this.selectHTML);
		}
		
    }.bind(this);

    /**
     * Recursive function to get all options
     * @param option
     * @returns {string}
     */
    this.getBranchOptions = function(option, baseIdent)
    {
        var selected = "";
        if (this.selectedItem == option.value)
            selected = "selected";

        var nbSpHtml = "";
        for (var i = 0, max = baseIdent * 3 ; i < max; i++)
        {
            nbSpHtml += "&nbsp;";
        }

        this.optionsHTML += '<option ' + selected + ' value="' + option.value + '">' + nbSpHtml + option.caption + '</option>';

        // Build all options
        if (option.childs != undefined)
        {
        	baseIdent++;
            option.childs.each(function(child)
            {
                this.getBranchOptions(child, baseIdent);
            }.bind(this));
        }
    }

    this.init();
}
