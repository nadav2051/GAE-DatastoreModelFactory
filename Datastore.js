    var tab_space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    function insertVariableTableRow()
    {
        var table = document.getElementById("model_variable_table");
        var last_row = table.rows.length;
        var row = table.insertRow(last_row);
        var cell1 = row.insertCell(0); // Property Name
        var cell2 = row.insertCell(1); // Property Type
        var cell3 = row.insertCell(2); // Repeated
        var cell4 = row.insertCell(3); // Getters
        cell1.appendChild(getPropertyNameElement(last_row));
        cell2.appendChild(getPropertyTypeElement(last_row));
        cell3.appendChild(getCheckBoxElement(0, last_row));
        cell4.appendChild(getCheckBoxElement(1, last_row));
    }

    function getPropertyNameElement(index)
    {
            var input_name = document.createElement("input");
            input_name.type = "text";
            input_name.placeholder = "variable" + index;
            input_name.id = "variable_" + index;
            input_name.value = "variable" + index;
            return input_name;
    }

    function getPropertyTypeElement(index)
    {
        //Create array of options to be added
        var array = ["IntegerProperty","FloatProperty","BooleanProperty","StringProperty",
        "TextProperty", "ByteStringProperty", "BlobProperty", "DateProperty", "TimeProperty",
        "DateTimeProperty", "GeoPtProperty", "PostalAddressProperty", "PhoneNumberProperty",
        "EmailProperty", "UserProperty", "IMProperty", "LinkProperty", "CategoryProperty",
        "RatingProperty", "ReferenceProperty", "SelfReferenceProperty", "ListProperty",
        "StringListProperty"];
        //Create and append select list
        var selectList = document.createElement("select");
        selectList.id = "variable_type_" + index;
        //Create and append the options
        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.value = array[i];
            option.text = array[i];
            selectList.appendChild(option);
        }
        // Return Select object to be appended to a DOM node.
        return selectList;
    }

    function getCheckBoxElement(type, index)
    {
        var id = (type == 0 ? "repeated_property_" + index : "getter_property_" + index);
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = id;
        checkbox.id = id;
        return checkbox;

    }

    function generateCode()
    {
        var class_name = document.getElementById("model_name_input");
        class_name = (class_name.value ? class_name.value : "ClassName");
        var canvas = document.getElementById("generated_code");
        var var_table = document.getElementById("model_variable_table");

        // Import NDB
        canvas.innerHTML = "from google.appengine.ext import ndb <br/><br/>";

        // Start of Class definition
        canvas.innerHTML += "class " + class_name + "(ndb.Model): <br/>";

        // Variables
        for (var i = 1; i < var_table.rows.length ; i++)
        {
            var variable_name = document.getElementById("variable_" + i).value;
            var variable_type = document.getElementById("variable_type_" + i).value;
            var variable_arguments = "";
            // Check if repeated is checked or not.
            var repeated_checked = document.getElementById("repeated_property_" + i).checked;
            if (repeated_checked)
            {
                variable_arguments = "repeated = True";
            }
            canvas.innerHTML += tab_space + variable_name + " = ndb." + variable_type +
                                "(" + variable_arguments + ")<br/>";
        }


        // Getters
        canvas.innerHTML += "<br/><br/># Getters <br\>";
        for (var i = 1; i < var_table.rows.length ; i++)
        {
            var variable_name = document.getElementById("variable_" + i).value;
            var variable_type = document.getElementById("variable_type_" + i).value;
            var variable_arguments = "";
            // Check if repeated is checked or not.
            var getter_checked = document.getElementById("getter_property_" + i).checked;
            if (getter_checked == false)
            {
                continue;
            }
            // Generic getters for all property types.
            generateGetter(canvas, variable_name, "key", class_name);
            generateGetter(canvas, variable_name, "id", class_name);

            // Specific getters for property types.
        }
    }

    // Getter types: 0 = Key, 1 = ID.
    function generateGetter(canvas, variable_name, getter_type, class_name)
    {
        var canvas = canvas;
        // @staticmethod
        canvas.innerHTML += tab_space + "@staticmethod<br\>";
        // function definition.
        canvas.innerHTML += tab_space + "get_" + variable_name + "_by_" + getter_type + "("+ getter_type +"):<br/>";
        // function body.
        // Generate key getter.
        if (getter_type.localeCompare("key") == 0)
        {
            canvas.innerHTML += tab_space + tab_space + "return key.get()."+variable_name+"<br/>";
        }
        // Generate ID getter.
        else if(getter_type.localeCompare("id") == 0)
        {
            canvas.innerHTML += tab_space + tab_space + "return " + class_name + ".get_by_id(id)." +variable_name+"<br/>";
        }
        // Shouldn't arrive here.
        else
        {
            alert("Something went wrong...");
        }
        canvas.innerHTML += "<br\>"
    }