/**
 * Created by jwilson on 12/02/2015.
 */

function onChangeCallRpc(observeId, urlTraining, selectId, selectName, selectClass, updateElement, defaultOption)
{
    this.name = observeId;
    this.urlTraining = urlTraining;
    this.selectId = selectId;
    this.selectName = selectName;
    this.selectClass = selectClass;
    this.updateElement = updateElement;
    this.defaultOption = defaultOption;

    this.invokeAction = function()
    {
        Event.observe(this.name, 'change', this.getAjaxData);
    }

    /**
     * Get all needed data through Ajax
     */
    this.getAjaxData = function ()
    {
        this.selectHTML = '<select id="' + this.selectId + '" name="' + this.selectName + '" class="' + this.selectClass + '">';
        new Ajax.Request(
            this.urlTraining,
            {
                method    : 'get',
                parameters: {team_level: $(this.name).getValue()},
                onSuccess : function (response)
                {
                    var ajaxData = response.responseJSON;
                    this.selectHTML += '<option value="">' + this.defaultOption + '</option>';
                    ajaxData.each(
                        function (option)
                        {
                            this.selectHTML += '<option value="' + option.value + '">' + option.caption + '</option>';
                        }.bind(this)
                    );
                    this.selectHTML += '</select>';
                    $(this.updateElement).innerHTML = '';
                    $(this.updateElement).update(this.selectHTML);
                }.bind(this)
            }
        )
    }.bind(this);
}
