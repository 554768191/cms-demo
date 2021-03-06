    $(function() {
        initDatagrid();
        /*$.getJSON("/birthPerson/getBirthPersonByCondition",function(json){
            $('#mTb').datagrid('loadData', json);
        });*/
    });

function initDatagrid() {
    $('#birthday').datebox({
        closeText:'关闭',
        formatter:function(date){
            var y = date.getFullYear();
            var m = date.getMonth()+1;
            var d = date.getDate();
            m = (m < 10 ? '0' : '') + m;
            return y+'-'+m+'-'+d;
        },
    });
    $('#birthdaySearch').datebox({
        closeText:'关闭',
        formatter:function(date){
            var y = date.getFullYear();
            var m = date.getMonth()+1;
            var d = date.getDate();
            m = (m < 10 ? '0' : '') + m;
            return y+'-'+m+'-'+d;
        },
    });
    $('#mTb').datagrid({
        loadMsg : '正在加载数据...',
        method : 'GET',
        url: "/birthPerson/getBirthPersonByCondition",
        striped : true,
        fitColumns : true,
        checkOnSelect : true,
        // 指明id为标识字段 跨页选择删除时不会取消上一页的选择
        idField : 'id',
        pagination : true,
        checkbox : true,
        fitColumns : true,
        pageSize : 10,
        pageList : [ 10, 20, 30],
        pageNumber : 1,
        columns : [ [ {
            field : 'id',
            title : '用户ID',
            width : 200
        }, {
            field : 'name',
            title : '姓名',
            width : 200
        }, {
            field : 'relation',
            title : '关系',
            width : 200
        }, {
            field : 'birthday',
            title : '生日',
            width : 200
        }, {
            field : 'address',
            title : '地址',
            width : 200
        },{
            field : 'gender',
            title : '性別',
            width : 200
        },{
            field : 'email',
            title : 'email',
            width : 200
        },{
            field : 'age',
            title : '年龄',
            width : 200
        } ] ],
        toolbar : '#tb'

    });
}
var url;
function newUser(){
    $('#dlg').dialog('open').dialog('setTitle','新增');
    $('#fm').form('clear');
    url = '/birthPerson/saveBirthPerson';
}
function editUser(){
    var row = $('#mTb').datagrid('getSelected');
    if (row){
        $('#dlg').dialog('open').dialog('setTitle','修改');
        $('#fm').form('load',row);
        $('#birthday').datebox('setValue', row.birthday);
        url = '/birthPerson/updateBirthPerson';
    }
}
function saveUser(){
    $('#fm').form('submit',{
        url: url,
        onSubmit: function(){
            return $(this).form('validate');
        },
        success: function(result){
            if (result != null){
                var resobj = eval("(" + result + ")");
                var desc = resobj.desc;
                $.messager.show({    // show error message
                    title: '提示',
                    msg: desc
                });
                $('#dlg').dialog('close');        // close the dialog
                $('#mTb').datagrid('reload');    // reload the user data
            } else {
                $.messager.show({    // show error message
                    title: '提示',
                    msg: '未知错误'
                });
            }
        }
    });
}
function removeUser(){
    var row = $('#mTb').datagrid('getSelections');
    var idString = "";
    for(var i=0 ; i < row.length; i++){
        if(i == 0){
            idString = row[i].id;
        } else {
            idString = idString + "," + row[i].id;
        }
    }
    var id = {id:idString};
    if (row){
        $.messager.confirm('确认','您确定要删除吗？',function(r){
            if (r){
                $.ajax({
                    method : 'POST',
                    url: "/birthPerson/deleteBirthPerson/",
                    dataType:"json",
                    data: id,
                    //async: false, //true:异步，false:同步
                    //contentType: false,
                    //processData: false,
                    success: function (data) {
                        $.messager.show({    // show error message
                            title: '提示',
                            msg: data.desc
                        });
                        $('#mTb').datagrid('reload');    // reload the user data
                    },
                    error: function (err) {
                        alert("error");

                    }});
                $.post('/birthPerson/deleteBirthPerson/', id, function(result){
                    if (result){
                        var resobj = JSON.parse(result);

                    } else {
                        $.messager.show({    // show error message
                            title: '提示',
                            msg: '位置错误'
                        });
                    }
                },'json');
            }
        });
    }
}

function doSearch(){
    var name = $("#name").val();
    var birthday = $('#birthdaySearch').datebox('getValue');
    var url = "/birthPerson/getBirthPersonByCondition";
    if(name){
        url = url + "?name=" + name;
        if(birthday){
            url = url + "&birthday=" + birthday;
        }
    } else {
        if(birthday){
            url = url + "?birthday=" + birthday;
        }
    }
    $.ajax({
        method : 'GET',
        url: url,
        dataType:"json",
        //async: false, //true:异步，false:同步
        //contentType: false,
        //processData: false,
        success: function (data) {
            $("#mTb").datagrid("loadData", data);
        },
        error: function (err) {
            alert("error");
        }
    });
}