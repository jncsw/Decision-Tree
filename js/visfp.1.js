$(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('select').material_select();
});

var input_data_row, input_data_col,
    input_data_attr, input_data,
    data_attr, data,
    x, y

$('#input_dim_confirm').click(function() {
    input_data_row = $('#input_dim_row').val()
    input_data_col = $('#input_dim_col').val()

    var thead_html = ""
    for (var i = 0; i < input_data_col; i++) {
        thead_html += '<th><input placeholder="属性" id="input_data_attr' + i + '" type="text" class="validate"></th>'
    }

    var tbody_html = ""
    for (var i = 0; i < input_data_row; i++) {
        tbody_html += "<tr>"
        for (var j = 0; j < input_data_col; j++) {
            tbody_html += '<td><input placeholder="数据" id="input_data_' + i + '_' + j + '" type="text" class="validate"></td>'
        }
        tbody_html += "</tr>"
    }

    $('#input_data_attr').html(thead_html)
    $('#input_data').html(tbody_html)

    $('#input_data_table').show()
})

$('#input_data_confirm').click(function() {
    input_data_attr = new Array()
    input_data = new Array()

    var xselect_html = '<option value="" disabled selected>分类依据</option>'
    var yselect_html = '<option value="" disabled selected>分类变量</option>'
    for (var i = 0; i < input_data_col; i++) {
        input_data_attr[i] = $('#input_data_attr' + i).val()
        xselect_html += '<option value="' + i + '">' + input_data_attr[i] + '</option>'
        yselect_html += '<option value="' + i + '">' + input_data_attr[i] + '</option>'
    }

    for (var i = 0; i < input_data_row; i++) {
        input_data[i] = new Array()
        for (var j = 0; j < input_data_col; j++) {
            input_data[i][j] = $('#input_data_' + i + '_' + j).val()
        }
    }

    $('#input_data_xselect').html(xselect_html)
    $('#input_data_yselect').html(yselect_html)

    $('select').material_select();

    $('#input_data_var').show()
    $('#input_data_finish').show()
})

$('#input_data_finish_button').click(function() {
    data_attr = input_data_attr
    data = input_data

    var xs = $('#input_data_xselect').val()
    x = new Array()
    for (var i = 0; i < xs.length; i++) {
        x[i] = parseInt(xs[i])
    }
    y = parseInt($('#input_data_yselect').val())
    $('#input_data_table').hide()
    $('#input_data_var').hide()
    $('#input_data_finish').hide()

    updateDataTable()
    $('#data_modal').modal('close')
})

function updateDataTable() {
    var thead_html = ""
    for (var i = 0; i < input_data_col; i++) {
        thead_html += '<th id="data_attr' + i + '">' + data_attr[i] + '</th>'
    }

    var tbody_html = ""
    for (var i = 0; i < input_data_row; i++) {
        tbody_html += '<tr id="data_row' + i + '">'
        for (var j = 0; j < input_data_col; j++) {
            tbody_html += '<td id="data_' + i + '_' + j + '">' + data[i][j] + '</td>'
        }
        tbody_html += "</tr>"
    }

    $('#data_table_attr').html(thead_html)
    $('#data_table_data').html(tbody_html)

    $('#data_table').show()

}

function entropy(p) {
    return 0
}


//
function split(item) {

}