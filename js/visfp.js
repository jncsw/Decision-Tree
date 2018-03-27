$(document).ready(function() {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('select').material_select();
    myChart = echarts.init(document.getElementById('tree'));
});

var input_data_row, input_data_col,
    input_data_attr, input_data,
    data_attr, data,
    x, y,
    tree, thistree,
    html_list, data_html_list, entropy_html_list, pseudo_html_list,
    frame,
    forward_function, backward_function,
    tree_data, tree_data_index,
    myChart,
    playControl, isPlaying,
    color = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'grey']

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
    for (var i = 0; i < data_attr.length; i++) {
        thead_html += '<th id="data_attr' + i + '">' + data_attr[i] + '</th>'
    }

    var tbody_html = ""
    for (var i = 0; i < data.length; i++) {
        tbody_html += '<tr id="data_row' + i + '">'
        for (var j = 0; j < data[i].length; j++) {
            tbody_html += '<td id="data_' + i + '_' + j + '">' + data[i][j] + '</td>'
        }
        tbody_html += "</tr>"
    }

    $('#data_table_attr').html(thead_html)
    $('#data_table_data').html(tbody_html)

    $('#data_table').show()

}
var playing = false
$('#play').click(function() {
    var temp = new Array()
    playing = true;
    for (var i = 0; i < data.length; i++) {
        temp[i] = i
    }
    html_list = new Array()
    tree_data = new Array()
    data_html_list = new Array()
    entropy_html_list = new Array()
    pseudo_html_list = new Array()
    html_list.push($('#main').html())
    tree = {}
    tree['name'] = "ROOT"
    thistree = tree
    split(temp)
    frame = 0
    tree_data_index = 0
})

function entropy(items, length) {
    var result = 0.0
    for (i in items) {
        if (typeof(items[i]) == 'object') {
            continue
        }
        var p = items[i] * 1.0 / length
        result += -p * Math.log2(p)
    }
    return result
}


//input No. Of Data
function split(items) {
    var klasses = {}
    for (var i = 0; i < items.length; i++) {
        var index = items[i]
        var klass = data[index][y]
        if (klasses[klass] == undefined) {
            klasses[klass] = 1
        } else {
            klasses[klass]++
        }
    }

    $('#step1').attr('class', 'green lighten-2')

    // var z = 0
    for (var i = 0; i < items.length; i++) {
        $('#data_row' + items[i]).attr('class', 'blue')
    }


    data_html_list.push($('#data_table_data').html())
    entropy_html_list.push($('#entropy_table_data').html())
    pseudo_html_list.push($('#pseudo_table').html())
    $('#step1').attr('class', null)
    for (var i = 0; i < items.length; i++) {
        $('#data_row' + items[i]).attr('class', null)
    }

    //Pure return
    for (i in klasses) {
        if (klasses[i] == items.length) {
            //Means Pure
            console.log('pure')
            thistree['children'] = new Array()
            thistree['children'][0] = { "name": i }

            var newTree = JSON.parse(JSON.stringify(tree));
            data_html_list.push('tree')
            entropy_html_list.push('tree')
            pseudo_html_list.push('tree')
            tree_data.push(newTree)

            // tree_data.push(tree)
            return
        }
    }

    var same = true
    for (var i = 1; i < items.length; i++) {
        for (var j = 0; j < x.length; j++) {
            if (data[items[i]][x[j]] != data[items[i - 1]][x[j]]) {
                same = false
                break
            }
        }
        if (!same) {
            break
        }
    }

    if (same) {
        console.log('purehahaha')
        return
    }
    //else

    $('#step2').attr('class', 'green lighten-2')
    data_html_list.push($('#data_table_data').html())
    entropy_html_list.push($('#entropy_table_data').html())
    pseudo_html_list.push($('#pseudo_table').html())


    //Entropy Of Klasses
    var D = entropy(klasses, items.length)

    //Animate
    var before = $('#main').html()

    for (var i = 0; i < items.length; i++) {
        $('#data_' + items[i] + '_' + y).addClass('blue')
            // $.parser.parse($('#data_' + items[i] + '_' + y))
    }

    addDataEntropy(D)

    // html_list.push($('#main').html())
    data_html_list.push($('#data_table_data').html())
    entropy_html_list.push($('#entropy_table_data').html())
    pseudo_html_list.push($('#pseudo_table').html())
        // $('#main').html(before)

    for (var i = 0; i < items.length; i++) {
        $('#data_' + items[i] + '_' + y).removeClass('blue')
            // $.parse.parse($('#data_' + items[i] + '_' + y))
    }
    //Animate

    var xEntropy = new Array()
    var xGain = new Array()
    var hEntropy = new Array()
    var IGR = new Array()
        //Calculate Entropy of Each X
    for (var i = 0; i < x.length; i++) {
        var currentX = x[i]; //Data中类别号
        var xklasses = {} //To calculate H
        var xyklasses = {}
        for (var j = 0; j < items.length; j++) {
            var index = items[j]
            var datax = data[index][currentX] //The attr currentX
            var datay = data[index][y]

            if (xklasses[datax] == undefined) {
                xklasses[datax] = 1
                    // xklasses[datax+'']
            } else {
                xklasses[datax]++
            }

            //Generate Each Attr InfoD
            if (xklasses[datax + 'Info'] == undefined) {
                xklasses[datax + 'Info'] = {}
            }

            if (xklasses[datax + 'Info'][datay] == undefined) {
                xklasses[datax + 'Info'][datay] = 1
            } else {
                xklasses[datax + 'Info'][datay]++
            }
        }



        hEntropy[i] = entropy(xklasses, items.length)
        xEntropy[i] = entropy2(xklasses, items.length)
        xGain[i] = D - xEntropy[i]
        if (hEntropy[i] != 0)
            IGR[i] = xGain[i] / hEntropy[i]
        else
            IGR[i] = 0

        //Animate
        var before = $('#main').html()

        for (var k = 0; k < items.length; k++) {
            $('#data_' + items[k] + '_' + currentX).addClass('blue')
                // $.parser.parse($('#data_' + items[i] + '_' + y))
            $('#data_' + items[k] + '_' + y).addClass('blue')
        }

        addAttrEntropy(data_attr[x[i]], i, IGR[i])

        // html_list.push($('#main').html())
        data_html_list.push($('#data_table_data').html())
        entropy_html_list.push($('#entropy_table_data').html())
        pseudo_html_list.push($('#pseudo_table').html())
        for (var k = 0; k < items.length; k++) {
            $('#data_' + items[k] + '_' + currentX).removeClass('blue')
                // $.parser.parse($('#data_' + items[i] + '_' + y))
            $('#data_' + items[k] + '_' + y).removeClass('blue')
        }

        // $('#main').html(before)
        //Animate
    }


    console.log(D)
    console.log(xEntropy)
    console.log(hEntropy)
    console.log(IGR)

    var maxindex = 0
    var maxigr = IGR[0]

    for (var i = 1; i < IGR.length; i++) {
        if (IGR[i] > maxigr) {
            maxigr = IGR[i]
            maxindex = i
        }
    }

    console.log(maxindex)
    console.log(maxigr)
    console.log(data_attr[x[maxindex]])


    //Animate
    $('#step2').attr('class', null)
    $('#step3').attr('class', "green lighten-2")

    for (var k = 0; k < items.length; k++) {
        $('#data_' + items[k] + '_' + x[maxindex]).addClass('green')
        $('#entropy_attr' + maxindex).addClass('green')
            // $.parser.parse($('#data_' + items[i] + '_' + y))
    }


    // html_list.push($('#main').html())
    data_html_list.push($('#data_table_data').html())
    entropy_html_list.push($('#entropy_table_data').html())
    pseudo_html_list.push($('#pseudo_table').html())
    for (var k = 0; k < items.length; k++) {
        $('#data_' + items[k] + '_' + x[maxindex]).removeClass('green')
        $('#entropy_attr' + maxindex).removeClass('green')
            // $.parser.parse($('#data_' + items[i] + '_' + y))
    }
    //Animate
    // for()


    var childItems = {}
    var attr = x[maxindex] //按attr列分
        // thistree['name'] += "/" + data_attr[attr]
    for (var i = 0; i < items.length; i++) {
        var index = items[i]

        var d = data[index][attr]

        if (childItems[d] == undefined) {
            childItems[d] = new Array()
        }
        childItems[d].push(index)
    }

    thistree['children'] = new Array()
    var k = 0
    for (i in childItems) {
        thistree['children'][k++] = { "name": data_attr[attr] + ':' + i }
    }

    // console.log(tree)
    // console.log(JSON.stringify(tree))
    // html_list.push('tree')
    $('#step3').attr('class', null)
    $('#step4').attr('class', "green lighten-2")
    data_html_list.push($('#data_table_data').html())
    entropy_html_list.push($('#entropy_table_data').html())
    pseudo_html_list.push($('#pseudo_table').html())


    data_html_list.push("tree")
    entropy_html_list.push('tree')
    pseudo_html_list.push('tree')
        // entropy_html_list.push($('#entropy_table_data').html())
    var newTree = JSON.parse(JSON.stringify(tree));
    tree_data.push(newTree)
    k = 0
    $('#step4').attr('class', null)
    $('#step5').attr('class', "green lighten-2")

    var z = 0
    for (i in childItems) {
        console.log(z)
        var group = childItems[i]
        for (var zz = 0; zz < group.length; zz++) {
            $('#data_row' + group[zz]).attr('class', color[z])
        }
        z = (z + 1) % color.length
    }

    data_html_list.push($('#data_table_data').html())
    entropy_html_list.push($('#entropy_table_data').html())
    pseudo_html_list.push($('#pseudo_table').html())

    for (i in childItems) {
        var group = childItems[i]
        for (var zz = 0; zz < group.length; zz++) {
            $('#data_row' + group[zz]).attr('class', null)
        }
    }

    var backup = thistree
    for (i in childItems) {
        $('#step5').attr('class', null)
        data_html_list.push($('#data_table_data').html())
        entropy_html_list.push($('#entropy_table_data').html())
        pseudo_html_list.push($('#pseudo_table').html())

        thistree = thistree['children'][k++]
        split(childItems[i])
        thistree = backup
    }
}

function entropy2(items, size) {
    var result = 0.0
    for (i in items) {
        if (typeof(items[i]) == 'object') {
            continue;
        }

        var length = items[i]

        var xd = items[i + 'Info']
        for (j in xd) {
            if (typeof(xd[j]) == 'object')
                continue
            var p = 1.0 * xd[j] / length
            result += (1.0 * length / size) * (-p * Math.log2(p))
        }
    }

    return result
}

function wait(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function addDataEntropy(entropy) {
    $('#entropy_table_data').html('<tr><th>infoD</th><th>' + entropy + '</th></tr>')
}

function addAttrEntropy(attr, i, entropy) {
    $('#entropy_table_data').append('<tr id="entropy_attr' + i + '"><th>' + attr + '</th><th>' + entropy + '</th></tr>')
}

function addAttrEntropyTransition(attr, i, entropy) {
    d3.select('#entropy_table_data').append('<tr id="entropy_attr' + i + '"><th>' + attr + '</th><th>' + entropy + '</th></tr>')
}

function next() {
    if (frame == 0) {
        $('#tree').remove()
        $('#treediv').append('<div id="tree" style="width: 500px;height:600px;"></div>')
        myChart = echarts.init(document.getElementById('tree'));
    }

    if (data_html_list[frame] == 'tree') {
        console.log('draw Tree')
        drawTree(tree_data[tree_data_index])
        tree_data_index = (tree_data_index + 1) % tree_data.length
    } else {
        // $('#main').html(html_list[frame])
        $('#data_table_data').html(data_html_list[frame])
        $('#entropy_table_data').html(entropy_html_list[frame])
        $('#pseudo_table').html(pseudo_html_list[frame])
    }
    frame = (frame + 1) % data_html_list.length
}

function retract() {
    d3.select('#main')
        .transition()
        .html(html_list[frame])
    frame = (frame + 1) % html_list.length
}

$('#next').click(function() {
    next()
})

$('#retract').click(function() {
    retract()
})

function drawTree(j) {
    myChart.setOption(option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [{
            type: 'tree',

            data: [j],

            left: '2%',
            right: '2%',
            top: '8%',
            bottom: '20%',

            symbol: 'emptyCircle',

            orient: 'vertical',

            expandAndCollapse: false,

            label: {
                normal: {
                    position: 'top',
                    rotate: 0,
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 20
                }
            },
            lineStyle: {
                normal: {
                    width: 5, //连线粗细
                    color: "#000000" //连线颜色
                }
            },

            leaves: {
                label: {
                    normal: {
                        position: 'bottom',
                        rotate: 0,
                        verticalAlign: 'middle',
                        align: 'left',
                        fontSize: 20
                    }
                }
            },

            animationDurationUpdate: 750
        }]
    });
}


var csvdata

$('#csv_url_confirm').click(function() {
    var url = $('#csv_url').val()
    $.get(url, function(data) {
        console.log(data)
        csvdata = data
        var line = data.split('\r\n')
        csv_attr = line[0].split(',')

        var xselect_html = ''
        var yselect_html = ''
        input_data_attr = new Array()
        data_attr = new Array()
        for (var i = 0; i < csv_attr.length; i++) {
            input_data_attr[i] = csv_attr[i]
            data_attr[i] = csv_attr[i]
            xselect_html += '<option value="' + i + '">' + input_data_attr[i] + '</option>'
            yselect_html += '<option value="' + i + '">' + input_data_attr[i] + '</option>'
        }
        console.log(xselect_html)
        console.log(yselect_html)

        $('#csv_xselect').html(xselect_html)
        $('#csv_yselect').html(yselect_html)

        $('select').material_select();

        $('#csv_data_var').show()
        $('#csv_confirm').show()

    })
})

$('#csv_confirm').click(function() {
    var line = csvdata.split('\r\n')
    data = new Array()
    for (var i = 1; i < line.length; i++) {
        if (line[i] == '')
            continue
        csv_data = line[i].split(',')
        data[i - 1] = new Array()
        for (var j = 0; j < csv_data.length; j++) {
            data[i - 1][j] = csv_data[j]
        }
    }

    var xs = $('#csv_xselect').val()
    x = new Array()
    for (var i = 0; i < xs.length; i++) {
        x[i] = parseInt(xs[i])
    }
    y = parseInt($('#csv_yselect').val())

    updateDataTable()
    $('#csv_modal').modal('close')

})

$('#autoplay').click(function() {
    if (!playing) {
        $("#play").click()
    }
    if (!isPlaying) {
        isPlaying = true
        playControl = setInterval(next, (100 - $('#speed').val()) / 1.0 * 10 + 500)
    }
})

$('#pause').click(function() {
    isPlaying = false
    window.clearInterval(playControl)
})

$('#speed').change(function() {
    // console.log(123)
    window.clearInterval(playControl)
    if (isPlaying)
        playControl = setInterval(next, (100 - $('#speed').val()) / 1.0 * 10 + 500)
})